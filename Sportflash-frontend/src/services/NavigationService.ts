import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '@app-types/navigation';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
    if (navigationRef.isReady()) {
        // @ts-ignore
        navigationRef.navigate(name, params);
    } else {
        console.warn('⚠️ Navigation requested but ref not ready:', name);
    }
}
