import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@store/store';
import AppNavigator from '@navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { theme } from '@utils/theme';
import { registerForPushNotificationsAsync } from './src/services/NotificationService';


export default function App() {
  // Force dark background on Web to prevent white flash
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.style.backgroundColor = theme.colors.background;
    }
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      // console.log("Push Token:", token);
    });
  }, []);


  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
