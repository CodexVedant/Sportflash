import Toast from 'react-native-toast-message';

/**
 * Redux Thunk to show a toast.
 * Usage: dispatch(showToast({ type: 'success', text1: 'Success', text2: 'Message' }))
 * 
 * @param {Object} params - Toast parameters
 * @param {string} params.type - 'success' | 'error' | 'info'
 * @param {string} params.text1 - Title
 * @param {string} params.text2 - Message (Subtitle)
 * @param {number} params.visibilityTime - Duration in ms (default 4000)
 */
export const showToast = ({ type = 'success', text1, text2, position = 'top', visibilityTime = 3000 }) => (dispatch) => {
    // We can also dispatch a log action here if needed for debugging/analytics
    // dispatch({ type: 'UI/TOAST_SHOWN', payload: { type, text1 } });

    Toast.show({
        type,
        text1,
        text2,
        position,
        visibilityTime,
        topOffset: 60, // Adjust for status bar / header
    });
};
