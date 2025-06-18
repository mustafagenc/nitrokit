'use client';

import { useState, useEffect } from 'react';

interface VersionData {
    version: string;
    name: string;
    success: boolean;
}

export function useVersion() {
    const [version, setVersion] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const response = await fetch('/api/version');
                const data: VersionData = await response.json();

                if (data.success) {
                    setVersion(data.version);
                } else {
                    setError('Version bilgisi alınamadı');
                }
            } catch (err) {
                setError('Network hatası');
                console.error('Version fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVersion();
    }, []);

    return { version, loading, error };
}
