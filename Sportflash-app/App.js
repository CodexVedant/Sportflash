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


import { toastConfig } from '@components/common/ToastConfig';

export default function App() {
  // Use existing useEffect logic...

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppNavigator />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
