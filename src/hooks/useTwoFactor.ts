import { useState } from 'react';
import { toast } from 'sonner';

export function useTwoFactor() {
    const [loading, setLoading] = useState(false);

    const setupTwoFactor = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/2fa/setup', {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Setup failed');

            return await response.json();
        } catch (error) {
            toast.error('Failed to setup 2FA');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const enableTwoFactor = async (secret: string, token: string, backupCodes: string[]) => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/2fa/enable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret, token, backupCodes }),
            });

            if (!response.ok) throw new Error('Enable failed');

            toast.success('2FA enabled successfully!');
            return true;
        } catch (error) {
            console.error('Enable 2FA error:', error);
            toast.error('Failed to enable 2FA');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const disableTwoFactor = async (token: string) => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/2fa/disable', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) throw new Error('Disable failed');

            toast.success('2FA disabled successfully!');
            return true;
        } catch (error) {
            console.error('Disable 2FA error:', error);
            toast.error('Failed to disable 2FA');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        setupTwoFactor,
        enableTwoFactor,
        disableTwoFactor,
    };
}
