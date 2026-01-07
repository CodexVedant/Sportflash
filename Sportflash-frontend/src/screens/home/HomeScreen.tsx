import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@utils/theme';
import { Ionicons } from '@expo/vector-icons';
import SearchModal from '@components/common/SearchModal';
import { useGetLiveMatchesQuery } from '@store/api/matchesApi';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationBell, NotificationPanel } from '@components/notifications';
import { initSocketListeners } from '@store/thunks/socketThunks';
import { selectAllLiveMatches } from '@store/slices/liveMatchesSlice';
import { mapMatchToUI } from '@utils/matchMappers';
import LiveMatchesWidget from '@screens/home/LiveMatchesWidget';
import TrendingNewsWidget from '@screens/home/TrendingNewsWidget';
import MenuToggle from '@components/navigation/MenuToggle';
import TopBar from '@components/navigation/TopBar';
import Sidebar from '@components/navigation/Sidebar';
import { styles } from '@utils/style/HomeScreen.styles';
import { SPORT_TABS, isDesktopSize, getMockNotifications } from '@utils/script/HomeScreen.helpers';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app-types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth);
    const { width } = useWindowDimensions();

    // UI Local State
    const [searchVisible, setSearchVisible] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [activeSport, setActiveSport] = useState('cricket');

    // Redux State - Single Source of Truth
    const allLiveMatches = useAppSelector(selectAllLiveMatches);
    // Explicitly type the result of the query hook if needed, but standard usage usually infers correctly
    const { isLoading: isMatchesLoading } = useGetLiveMatchesQuery(undefined);

    // Derived State (Filtering)
    const matches = React.useMemo(() => {
        // Ensure allLiveMatches is an array
        const liveMatchesArray = Array.isArray(allLiveMatches) ? allLiveMatches : [];

        const live = liveMatchesArray
            .map(mapMatchToUI)
            .filter(m => m.status === 'live');

        return activeSport === 'all'
            ? live
            : live.filter(m => m.sport?.toLowerCase() === activeSport);
    }, [allLiveMatches, activeSport]);

    const loading = isMatchesLoading && matches.length === 0;

    // Initialize Socket Listeners
    useEffect(() => {
        // Dispatch returns a Promise from thunks, but useEffect cleanup expects void or a cleanup function
        dispatch(initSocketListeners());
        // Optional: return () => dispatch(stopSocketListeners());
    }, [dispatch]);

    // Mock notifications (Keeping existing logic)
    const [notifications] = useState(getMockNotifications());

    // Responsive Logic
    const isDesktop = isDesktopSize(width);

    return (
        <SafeAreaView style={styles.container}>
            <SearchModal visible={searchVisible} onClose={() => setSearchVisible(false)} />
            <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
            <NotificationPanel
                visible={notificationVisible}
                onClose={() => setNotificationVisible(false)}
                notifications={notifications}
                onNotificationPress={(notification) => {
                    console.log('Notification pressed:', notification);
                    setNotificationVisible(false);
                }}
            />

            {/* Header */}
            <View style={[styles.header, isDesktop && styles.headerDesktop]}>
                {/* Menu Icon (Always Visible) */}
                <MenuToggle onPress={() => setSidebarVisible(true)} />

                <View style={[styles.logoContainer, isDesktop && styles.logoContainerDesktop]}>
                    <Text style={styles.logoText}>Sport<Text style={styles.highlight}>Flash</Text></Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => setSearchVisible(true)}>
                        <Ionicons name="search" size={24} color={theme.colors.text} style={{ marginRight: 16 }} />
                    </TouchableOpacity>

                    {user ? (
                        <NotificationBell
                            count={notifications.filter(n => !n.read).length}
                            onPress={() => setNotificationVisible(true)}
                        />
                    ) : (
                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.loginBtnText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Sport Tabs */}
            <TopBar
                activeTab={activeSport}
                onTabChange={setActiveSport}
                tabs={SPORT_TABS}
            />

            {/* Live Section */}
            <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop, { flex: 1 }]}>
                <LiveMatchesWidget
                    matches={matches} // Use filtered/derived matches here
                    loading={loading}
                    width={width}
                    navigation={navigation}
                    gap={theme.spacing.md}
                    ListFooterComponent={
                        <>
                            {/* Trending News Placeholder */}
                            <TrendingNewsWidget sport={activeSport} />
                            {/* Bottom spacing for TabBar */}
                            <View style={{ height: 80 }} />
                        </>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

