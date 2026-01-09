import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import Toast from 'react-native-toast-message';
import { styles } from '@utils/style/ToastContext.styles';

type ToastType = 'info' | 'error' | 'success';

interface Toast {
    message: string;
    type: ToastType;
    id: number;
}

interface ToastContextData {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const useToast = (): ToastContextData => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    // We don't need local state for Toast anymore as react-native-toast-message handles it globaly

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        Toast.show({
            type: type,
            text1: type === 'error' ? 'Error' : 'Notification',
            text2: message,
            position: 'top',
            visibilityTime: 3000,
        });
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
};
