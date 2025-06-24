import { Geist, Geist_Mono, Lexend, Montserrat } from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const lexend = Lexend({
    variable: '--font-lexend',
    subsets: ['latin'],
    display: 'swap',
});

const montserrat = Montserrat({
    variable: '--font-montserrat',
    subsets: ['latin'],
    display: 'swap',
});

export { geistSans, geistMono, lexend, montserrat };
