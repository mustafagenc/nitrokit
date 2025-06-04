'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AvatarContextType {
    avatarUrl: string | null;
    updateAvatar: (url: string | null) => void;
    removeAvatar: () => void;
    initializeAvatar: (url: string | null) => void;
    forceUpdate: number;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

interface AvatarProviderProps {
    children: ReactNode;
}

export function AvatarProvider({ children }: AvatarProviderProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);

    const updateAvatar = useCallback((url: string | null) => {
        setAvatarUrl(url);
        setForceUpdate(prev => prev + 1);
    }, []);

    const removeAvatar = useCallback(() => {
        setAvatarUrl(null);
        setForceUpdate(prev => prev + 1);
    }, []);

    const initializeAvatar = useCallback((url: string | null) => {
        setAvatarUrl(url);
        setForceUpdate(prev => prev + 1);
    }, []);

    return (
        <AvatarContext.Provider
            value={{
                avatarUrl,
                updateAvatar,
                removeAvatar,
                initializeAvatar,
                forceUpdate,
            }}>
            {children}
        </AvatarContext.Provider>
    );
}

export function useAvatar() {
    const context = useContext(AvatarContext);
    if (context === undefined) {
        throw new Error('useAvatar must be used within an AvatarProvider');
    }
    return context;
}
