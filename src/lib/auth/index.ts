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
const defaultReceiveUpdates = true;

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Resend,
        Google({
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email || '',
                    name: profile.name || null,
                    image: profile.picture || null,
                    firstName: profile.given_name || null,
                    lastName: profile.family_name || null,
                    role: defaultRole,
                    locale: profile.locale || defaultLocale,
                    theme: defaultTheme,
                    receiveUpdates: defaultReceiveUpdates,
                    twoFactorEnabled: false,
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
                };
            },
        }),
        GitHub({
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    email: profile.email || '',
                    name: profile.name || profile.login || null,
                    image: profile.avatar_url || null,
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    receiveUpdates: defaultReceiveUpdates,
                    twoFactorEnabled: false,
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
                };
            },
        }),
        GitLab({
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    email: profile.email || '',
                    name: profile.name || null,
                    image: profile.avatar_url || null,
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    receiveUpdates: defaultReceiveUpdates,
                    twoFactorEnabled: false,
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
                };
            },
        }),
        Facebook({
            profile(profile) {
                return {
                    id: profile.id,
                    email: profile.email || '',
                    name: profile.name || null,
                    image: profile.picture?.data?.url || null,
                    role: defaultRole,
                    locale: profile.locale || defaultLocale,
                    theme: defaultTheme,
                    receiveUpdates: defaultReceiveUpdates,
                    twoFactorEnabled: false,
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
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
                        null,
                    image: profile.picture || null,
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    receiveUpdates: defaultReceiveUpdates,
                    twoFactorEnabled: false,
                    emailVerified: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
                };
            },
        }),
        Instagram({
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    email: profile.email || '',
                    name: profile.name || profile.username || null,
                    image: profile.picture || null,
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    receiveUpdates: defaultReceiveUpdates,
                    twoFactorEnabled: false,
                    emailVerified: !!profile.email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
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
                    name: data.name || data.username || null,
                    image: data.profile_image_url?.replace('_normal', '_400x400') || null,
                    firstName: data.name?.split(' ')[0] || null,
                    lastName: data.name?.split(' ').slice(1).join(' ') || null,
                    username: data.username || null,
                    role: defaultRole,
                    locale: defaultLocale,
                    theme: defaultTheme,
                    receiveUpdates: defaultReceiveUpdates,
                    twoFactorEnabled: false,
                    emailVerified: !!data.email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
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
                const firstName = profile.firstName || profile.given_name || null;
                const lastName = profile.lastName || profile.family_name || null;
                return {
                    id: profile.id || profile.sub || '',
                    email: email,
                    name:
                        profile.name ||
                        `${firstName} ${lastName}`.trim() ||
                        profile.localizedFirstName ||
                        null,
                    image:
                        profile.picture ||
                        profile.profilePicture?.displayImage ||
                        profile['profilePicture(displayImage~:playableStreams)']?.displayImage
                            ?.elements?.[0]?.identifiers?.[0]?.identifier ||
                        null,
                    firstName: firstName,
                    lastName: lastName,
                    username: profile.vanityName || null,
                    role: defaultRole,
                    locale: profile.locale || defaultLocale,
                    theme: defaultTheme,
                    receiveUpdates: defaultReceiveUpdates,
                    twoFactorEnabled: false,
                    emailVerified: !!email,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isActive: true,
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

                    const { ...userWithoutPassword } = user;
                    return {
                        ...userWithoutPassword,
                        emailVerified: !!user.emailVerified,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        isActive: user.isActive,
                        lastLoginAt: user.lastLoginAt || undefined,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            },
        }),
    ],
    events: {
        async session({ session }) {
            if (session?.user?.id) {
                try {
                    await prisma.user.update({
                        where: { id: session.user.id },
                        data: { lastLoginAt: new Date() },
                    });
                } catch (error) {
                    console.error('Failed to update last login:', error);
                }
            }
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'credentials') {
                return true;
            }

            if (user.email) {
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                        include: {
                            accounts: true,
                        },
                    });

                    if (existingUser) {
                        const existingAccount = existingUser.accounts.find(
                            (acc) => acc.provider === account?.provider
                        );

                        if (!existingAccount && account) {
                            console.log(
                                `Linking ${account.provider} to existing user ${existingUser.id}`
                            );
                        }

                        user.id = existingUser.id;
                        return true;
                    }

                    return true;
                } catch (error) {
                    console.error('Account linking error:', error);
                    return false;
                }
            }

            return true;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub;
                session.user.email = token.email || '';
                session.user.name = token.name || null;
                session.user.image = token.picture || null;
                session.user.role = token.role;
                session.user.locale = token.locale || 'en';
                session.user.theme = token.theme || 'light';
                session.user.receiveUpdates = token.receiveUpdates ?? true;
                session.user.phoneVerified = token.phoneVerified;
                session.user.twoFactorEnabled = token.twoFactorEnabled;
                session.user.refreshToken = token.refreshToken;

                const dbUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                    include: { accounts: true },
                });

                if (dbUser) {
                    session.user.linkedAccounts = dbUser.accounts.map((account) => ({
                        provider: account.provider,
                        type: account.type,
                        providerAccountId: account.providerAccountId,
                        accessToken: account.access_token,
                        refreshToken: account.refresh_token,
                        expiresAt: account.expires_at,
                    }));
                }
            }

            return session;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
                token.twoFactorEnabled = user.twoFactorEnabled;

                if (account) {
                    const refreshToken = await generateRefreshToken(user.id);
                    token.refreshToken = refreshToken;
                }
            }

            const shouldRefresh =
                token.exp && token.exp - Math.floor(Date.now() / 1000) < 24 * 60 * 60; // 24 saat

            if (shouldRefresh && token.refreshToken) {
                try {
                    const newTokens = await refreshAccessToken(token.refreshToken as string);
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
    // debug: process.env.NODE_ENV === 'development',
    debug: false, // Set to true for development
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
