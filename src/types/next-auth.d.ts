import 'next-auth';
import 'next-auth/jwt';
import { locales } from '@/constants/locale';

export type UserRole = 'User' | 'Admin' | 'Moderator';
export type Theme = 'light' | 'dark' | 'system';
export type Locale = (typeof locales)[number];

export interface LinkedAccount {
    provider: string;
    type: string;
    providerAccountId: string;
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
}

declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        name?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        username?: string | null;
        image?: string | null;
        phone?: string | null;
        phoneVerified?: boolean | null;
        role: UserRole;
        twoFactorEnabled?: boolean;
        emailVerified?: boolean;
        locale: Locale;
        theme: string;
        receiveUpdates: boolean;
        refreshToken?: string;
        linkedAccounts?: LinkedAccount[];
        createdAt: Date;
        updatedAt: Date;
        lastLoginAt?: Date;
        lastActivityAt?: Date;
        isActive: boolean;
        preferences?: {
            notifications: {
                email: boolean;
                push: boolean;
                inApp: boolean;
            };
        };
    }

    interface Session {
        user: User;
        expires: Date;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub: string;
        email?: string;
        name?: string;
        picture?: string;
        role: UserRole;
        locale?: Locale;
        theme?: Theme;
        receiveUpdates?: boolean;
        phoneVerified?: boolean | null;
        twoFactorEnabled?: boolean;
        refreshToken?: string;
        exp?: number;
        iat?: number;
        jti?: string;
    }
}
