import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import GitLab from 'next-auth/providers/gitlab';
import Google from 'next-auth/providers/google';
import Resend from 'next-auth/providers/resend';

import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

// class InvalidLoginError extends CredentialsSignin {
//   code = "Invalid identifier or password"
// }

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        GitHub,
        GitLab,
        Resend,
        Credentials({
            credentials: {
                email: { label: 'E-mail', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            // authorize: async (credentials) => {
            //   let user = null
            //   const pwHash = saltAndHashPassword(credentials.password)
            //   user = await getUserFromDb(credentials.email, pwHash)
            //   if (!user) {
            //     throw new Error("Invalid credentials.")
            //   }
            //   return user
            // },
            // async authorize(credentials, request) {
            //   if (!request) throw new InvalidLoginError();
            //   const response = await fetch(request)
            //   if (!response.ok) throw new InvalidLoginError();
            //   return (await response.json()) ?? null
            // },
            async authorize(credentials) {
                // Add your logic here to look up the user from the credentials supplied
                // For example, find a user in your database:
                // const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                // if (user && bcrypt.compareSync(credentials.password, user.password)) {
                //   return user; // Return user object if credentials are valid
                // }
                // If you return null then an error will be displayed advising the user to check their details.
                // return null;

                // Or, if you want to throw a specific error:
                // throw new Error("Invalid credentials");

                // Placeholder: Replace with your actual authentication logic
                if (
                    credentials?.email === 'user@example.com' &&
                    credentials?.password === 'password'
                ) {
                    return { id: '1', name: 'Test User', email: 'user@example.com' };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/signin',
    },
});
