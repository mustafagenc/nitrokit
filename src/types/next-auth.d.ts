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
    }

    interface Session {
        user: {
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
            locale: string;
            theme: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub: string;
        role: string;
        phoneVerified?: boolean | null;
        twoFactorEnabled?: boolean;
    }
}
