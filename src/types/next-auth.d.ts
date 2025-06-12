import 'next-auth';
import 'next-auth/jwt';

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
        role: string;
        twoFactorEnabled?: boolean;
        emailVerified?: boolean;
        locale: string;
        theme: string;
        refreshToken?: string;
        linkedAccounts?: Array<{
            provider: string;
            type: string;
        }>;
    }

    interface Session {
        user: User;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub: string;
        role: string;
        locale?: string;
        theme?: string;
        phoneVerified?: boolean | null;
        twoFactorEnabled?: boolean;
        refreshToken?: string;
        exp?: number;
        iat?: number;
        jti?: string;
    }
}
