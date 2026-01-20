import { API_BASE_URL } from '@config';

/**
 * Validate password requirements
 */
export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Check if passwords match
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password.length > 0;
};

/**
 * Check if password meets minimum length requirement
 */
export const meetsMinLength = (password: string): boolean => {
    return password.length >= 6;
};

/**
 * Send reset password request
 */
export const sendResetPasswordRequest = async (resetToken: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/resetpassword/${resetToken}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
    }

    return data;
};
