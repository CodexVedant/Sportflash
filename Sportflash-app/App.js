import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from './src/context/ToastContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AppNavigator />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
