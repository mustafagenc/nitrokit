'use client';

import { ThemeProvider } from 'next-themes';

import { Theme } from '@radix-ui/themes';

export default function NextThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Theme>{children}</Theme>
        </ThemeProvider>
    );
}
