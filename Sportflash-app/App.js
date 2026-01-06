import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import AppNavigator from '@navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from '@context/ToastContext';
import { theme } from '@utils/theme';


export default function App() {
  // Force dark background on Web to prevent white flash
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.style.backgroundColor = theme.colors.background;

      // Hide scrollbars globally for webkit browsers (Chrome, Safari, Edge)
      const style = document.createElement('style');
      style.textContent = `
        /* Hide scrollbar for Chrome, Safari and Opera */
        *::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        * {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ToastProvider>
          <AppNavigator />
        </ToastProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
