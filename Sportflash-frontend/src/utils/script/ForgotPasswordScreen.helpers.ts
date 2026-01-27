import { API_BASE_URL } from '@config';

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Send forgot password request
 */
export const sendForgotPasswordRequest = async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgotpassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
    }

    return data;
};
