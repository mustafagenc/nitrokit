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
import { TwoFactorService } from './lib/auth/two-factor-service';

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        GitHub,
        GitLab,
        Resend,
        Apple,
        Instagram,
        Facebook,
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
                    console.log(token);
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
        async signIn({ user, account }) {
            if (account?.provider !== 'credentials') {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (dbUser) {
                    user.role = dbUser.role;
                } else {
                    user.role = 'USER';
                }
            }
            return true;
        },
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/signin',
        error: '/auth/error',
    },
});
