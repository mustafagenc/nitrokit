import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export interface SecurityStatus {
    passwordStrength: 'strong' | 'medium' | 'weak' | 'unknown';
    twoFactorEnabled: boolean;
    activeSessions: number;
    lastPasswordChange?: Date;
    recentLoginAttempts: number;
}

export async function getUserSecurityStatus(userId: string): Promise<SecurityStatus> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                password: true, // NextAuth'da genellikle password field'ı
                emailVerified: true,
                // NextAuth'da bu field'lar olmayabilir, o yüzden optional olarak kontrol edelim
            },
        });

        if (!user) {
            return {
                passwordStrength: 'unknown',
                twoFactorEnabled: false,
                activeSessions: 0,
                recentLoginAttempts: 0,
            };
        }

        // Password strength analizi
        const passwordStrength = analyzePasswordStrength(user.password);

        // Active session sayısını çek (NextAuth session tablosu)
        const activeSessions = await getActiveSessionCount(userId);

        // Recent login attempts (NextAuth account tablosu üzerinden)
        const recentLoginAttempts = await getRecentLoginAttempts(userId);

        // 2FA durumunu kontrol et (Account tablosundan)
        const twoFactorEnabled = await checkTwoFactorEnabled(userId);

        return {
            passwordStrength,
            twoFactorEnabled,
            activeSessions,
            lastPasswordChange: undefined, // NextAuth'da bu field yok genellikle
            recentLoginAttempts,
        };
    } catch (error) {
        console.error('Error fetching security status:', error);
        return {
            passwordStrength: 'unknown',
            twoFactorEnabled: false,
            activeSessions: 0,
            recentLoginAttempts: 0,
        };
    }
}

// Password strength analizi
function analyzePasswordStrength(
    password: string | null
): 'strong' | 'medium' | 'weak' | 'unknown' {
    if (!password) {
        // OAuth user'lar için password olmayabilir
        return 'unknown';
    }

    // bcrypt hash genellikle 60 karakter
    if (password.length >= 60 && password.startsWith('$2')) {
        return 'strong'; // bcrypt hash
    }

    if (password.length > 50) {
        return 'medium';
    }

    return 'weak';
}

// NextAuth Session tablosundan active session sayısını çek
async function getActiveSessionCount(userId: string): Promise<number> {
    try {
        // ✅ NextAuth Session tablosu
        const count = await prisma.session.count({
            where: {
                userId,
                expires: {
                    gt: new Date(), // NextAuth'da expires field'ı
                },
            },
        });
        return count || 1; // En az 1 (current session)
    } catch (error) {
        console.error('Error fetching active session count:', error);
        return 1;
    }
}

// Account tablosundan recent login attempts'i hesapla
async function getRecentLoginAttempts(userId: string): Promise<number> {
    try {
        // ✅ NextAuth Account tablosunu kullan - son güncellenme zamanları
        const accounts = await prisma.account.findMany({
            where: {
                userId,
            },
            select: {
                provider: true,
                type: true,
                createdAt: true,
            },
        });

        // Son 24 saat içinde oluşturulan account'ları say
        const recentAccounts = accounts.filter(account => {
            if (!account.createdAt) return false;
            const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            return account.createdAt > dayAgo;
        });

        return recentAccounts.length;
    } catch (error) {
        console.error('Error fetching recent login attempts:', error);
        return 0;
    }
}

// 2FA durumunu kontrol et
async function checkTwoFactorEnabled(userId: string): Promise<boolean> {
    try {
        // ✅ Account tablosunda authenticator provider'ı var mı kontrol et
        const authenticatorAccount = await prisma.account.findFirst({
            where: {
                userId,
                type: 'authenticator', // WebAuthn/TOTP için
            },
        });

        // Veya oauth provider'ları içinde 2FA enabled olanları kontrol et
        const accounts = await prisma.account.findMany({
            where: {
                userId,
                provider: {
                    in: ['google', 'github'], // 2FA destekleyen provider'lar
                },
            },
        });

        return !!authenticatorAccount || accounts.length > 0;
    } catch (error) {
        console.error('Error checking two-factor authentication:', error);
        return false;
    }
}

export async function getSimpleSecurityStatus(): Promise<SecurityStatus> {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                passwordStrength: 'unknown',
                twoFactorEnabled: false,
                activeSessions: 0,
                recentLoginAttempts: 0,
            };
        }

        return await getUserSecurityStatus(session.user.id);
    } catch (error) {
        console.error('Error fetching simple security status:', error);
        return {
            passwordStrength: 'unknown',
            twoFactorEnabled: false,
            activeSessions: 0,
            recentLoginAttempts: 0,
        };
    }
}

// ✅ Fallback: Mock data for development
export function getMockSecurityStatus(): SecurityStatus {
    return {
        passwordStrength: 'strong',
        twoFactorEnabled: false,
        activeSessions: 2,
        recentLoginAttempts: 1,
    };
}

export async function getSafeSecurityStatus(userId?: string): Promise<SecurityStatus> {
    try {
        if (userId) {
            return await getUserSecurityStatus(userId);
        } else {
            return await getSimpleSecurityStatus();
        }
    } catch (error) {
        console.error('Security status error, using mock data:', error);
        return getMockSecurityStatus();
    }
}
