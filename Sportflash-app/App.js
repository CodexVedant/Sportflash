import { Provider } from 'react-redux';
import { store } from '@store/store';
import AppNavigator from '@navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@context/ToastContext';
import { AuthProvider } from '@context/AuthContext';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ToastProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
