import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import GitLab from 'next-auth/providers/gitlab';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import Apple from 'next-auth/providers/apple';
import Instagram from 'next-auth/providers/instagram';
import Facebook from 'next-auth/providers/facebook';
import Twitter from 'next-auth/providers/twitter';
import LinkedIn from 'next-auth/providers/linkedin';
import bcrypt from 'bcryptjs';
import { generateRefreshToken, refreshAccessToken } from './tokens';

import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { TwoFactorService } from './two-factor-service';

const defaultLocale = 'en';
const defaultTheme = 'system';
const defaultRole = 'User';

declare module 'next-auth' {
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
            refreshToken?: string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub: string;
        role: string;
        phoneVerified?: boolean | null;
        twoFactorEnabled?: boolean;
        refreshToken?: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Resend,
        Google({
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email || '',
                    name: profile.name || '',
                    image: profile.picture || '',
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    role: defaultRole,
                    locale: profile.locale || defaultLocale,
                    theme: defaultTheme,
                    twoFactorEnabled: false,
                    emailVerified: true,
                };
            },
        }),
        GitHub({
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    email: profile.email || '',
                    name: profile.name || profile.login || '',
                    image: profile.avatar_url || '',
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    twoFactorEnabled: false,
                    emailVerified: true,
                };
            },
        }),
        GitLab({
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    email: profile.email || '',
                    name: profile.name || '',
                    image: profile.avatar_url || '',
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    twoFactorEnabled: false,
                    emailVerified: true,
                };
            },
        }),
        Facebook({
            profile(profile) {
                return {
                    id: profile.id,
                    email: profile.email || '',
                    name: profile.name || '',
                    image: profile.picture?.data?.url || '',
                    role: defaultRole,
                    locale: profile.locale || defaultLocale,
                    theme: defaultTheme,
                    twoFactorEnabled: false,
                    emailVerified: true,
                };
            },
        }),
        Apple({
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email || '',
                    name:
                        profile.name ||
                        `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
                        '',
                    image: profile.picture || '',
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    twoFactorEnabled: false,
                    emailVerified: true,
                };
            },
        }),
        Instagram({
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    email: profile.email || '',
                    name: profile.name || profile.username || '',
                    image: profile.picture || '',
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    twoFactorEnabled: false,
                    emailVerified: !!profile.email,
                };
            },
        }),
        Twitter({
            authorization: {
                url: 'https://twitter.com/i/oauth2/authorize',
                params: {
                    scope: 'tweet.read users.read offline.access',
                    response_type: 'code',
                    code_challenge_method: 'S256',
                },
            },
            token: 'https://api.twitter.com/2/oauth2/token',
            userinfo:
                'https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url',
            profile(profile) {
                const data = profile.data || profile;
                return {
                    id: data.id?.toString() || profile.id?.toString() || '',
                    email: data.email || '',
                    name: data.name || data.username || '',
                    image: data.profile_image_url?.replace('_normal', '_400x400') || '',
                    firstName: data.name?.split(' ')[0] || '',
                    lastName: data.name?.split(' ').slice(1).join(' ') || '',
                    username: data.username || '',
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    twoFactorEnabled: false,
                    emailVerified: !!data.email,
                };
            },
        }),
        LinkedIn({
            authorization: {
                params: {
                    scope: 'openid profile email',
                },
            },
            profile(profile) {
                const email = profile.email || profile.emailAddress || '';
                const firstName = profile.firstName || profile.given_name || '';
                const lastName = profile.lastName || profile.family_name || '';
                return {
                    id: profile.id || profile.sub || '',
                    email: email,
                    name:
                        profile.name ||
                        `${firstName} ${lastName}`.trim() ||
                        profile.localizedFirstName ||
                        '',
                    image:
                        profile.picture ||
                        profile.profilePicture?.displayImage ||
                        profile['profilePicture(displayImage~:playableStreams)']?.displayImage
                            ?.elements?.[0]?.identifiers?.[0]?.identifier ||
                        '',
                    firstName: firstName,
                    lastName: lastName,
                    username: profile.vanityName || '', // LinkedIn vanity URL
                    role: defaultRole,
                    locale: profile.locale || defaultLocale,
                    theme: defaultTheme,
                    twoFactorEnabled: false,
                    emailVerified: !!email,
                };
            },
        }),
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                twoFactorCode: { label: '2FA Code', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email as string,
                            isActive: true,
                        },
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    if (!user.emailVerified) {
                        return null;
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!isValidPassword) {
                        return null;
                    }

                    if (user.twoFactorEnabled) {
                        if (!credentials.twoFactorCode) {
                            return null;
                        }

                        const verification = await TwoFactorService.verifyToken(
                            user.id,
                            credentials.twoFactorCode as string
                        );

                        if (!verification.success) {
                            return null;
                        }
                    }

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { lastLoginAt: new Date() },
                    });

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: user.role,
                        twoFactorEnabled: user.twoFactorEnabled,
                        emailVerified: !!user.emailVerified,
                        locale: user.locale || 'en',
                        theme: user.theme || 'light',
                    };
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    events: {
        async session({ session, token }) {
            if (session?.user?.id) {
                try {
                    await prisma.user.update({
                        where: { id: session.user.id },
                        data: { lastLoginAt: new Date() },
                    });
                    console.info('Session updated', token);
                } catch (error) {
                    console.error('Failed to update last login:', error);
                }
            }
        },
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                session.user.role = token.role;
                session.user.twoFactorEnabled = token.twoFactorEnabled;
                session.user.locale = (token.locale as string) || 'en';
                session.user.theme = (token.theme as string) || 'light';
                session.user.refreshToken = token.refreshToken;

                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.sub },
                        select: {
                            name: true,
                            image: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                        },
                    });

                    if (dbUser) {
                        session.user.name = dbUser.name;
                        session.user.image = dbUser.image;
                        session.user.firstName = dbUser.firstName;
                        session.user.lastName = dbUser.lastName;
                        session.user.username = dbUser.username;
                    }
                } catch (error) {
                    console.error('Session update error:', error);
                }
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
                token.twoFactorEnabled = user.twoFactorEnabled;

                // Yeni bir refresh token oluştur
                if (account) {
                    const refreshToken = await generateRefreshToken(user.id);
                    token.refreshToken = refreshToken;
                }
            }

            // Token'ın süresi dolmak üzereyse yenile
            const shouldRefresh =
                token.exp && token.exp - Math.floor(Date.now() / 1000) < 24 * 60 * 60; // 24 saat

            if (shouldRefresh && token.refreshToken) {
                try {
                    const newTokens = await refreshAccessToken(token.refreshToken);
                    return {
                        ...token,
                        ...newTokens,
                    };
                } catch (error) {
                    console.error('Token refresh error:', error);
                    return token;
                }
            }

            return token;
        },
    },
    pages: {
        signIn: '/signin',
        signOut: '/signout',
        error: '/error',
        verifyRequest: '/verify-request',
        newUser: '/new-user',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 gün
        updateAge: 24 * 60 * 60, // 24 saat
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 gün
    },
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookies: {
        sessionToken: {
            name:
                process.env.NODE_ENV === 'production'
                    ? '__Secure-authjs.session-token'
                    : 'authjs.session-token',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
});
