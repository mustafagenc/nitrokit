import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import GitLab from 'next-auth/providers/gitlab';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';
import Apple from 'next-auth/providers/apple';
import Instagram from 'next-auth/providers/instagram';
import Facebook from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { TwoFactorService } from './two-factor-service';

const defaultLocale = 'en';
const defaultTheme = 'system';
const defaultRole = 'User';

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
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                token.role = user.role;
                token.twoFactorEnabled = user.twoFactorEnabled;
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
    },
    secret: process.env.NEXTAUTH_SECRET,
});
