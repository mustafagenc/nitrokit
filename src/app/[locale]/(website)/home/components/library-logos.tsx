import { ThemedImage } from '@/components/shared/themed-image';
import React from 'react';

const logos = [
    {
        darkSrc: '/images/brands/nextjs-white.svg',
        lightSrc: '/images/brands/nextjs-black.svg',
        alt: 'Next.js',
        width: 150,
        height: 30,
        href: 'https://nextjs.org/',
    },
    {
        darkSrc: '/images/brands/typescript.svg',
        lightSrc: '/images/brands/typescript.svg',
        alt: 'Typescript',
        width: 36,
        height: 36,
        href: 'https://www.typescriptlang.org/',
    },
    {
        darkSrc: '/images/brands/tailwindcss.svg',
        lightSrc: '/images/brands/tailwindcss.svg',
        alt: 'Tailwind CSS',
        width: 50,
        height: 30,
        href: 'https://tailwindcss.com/',
    },
    {
        darkSrc: '/images/brands/prisma-white.svg',
        lightSrc: '/images/brands/prisma-black.svg',
        alt: 'Prisma',
        width: 100,
        height: 30,
        href: 'https://www.prisma.io/',
    },
    {
        darkSrc: '/images/brands/radix-white.svg',
        lightSrc: '/images/brands/radix-black.svg',
        alt: 'Radix-UI',
        width: 95,
        height: 30,
        href: 'https://www.radix-ui.com/',
    },
    {
        darkSrc: '/images/brands/next-intl-white.svg',
        lightSrc: '/images/brands/next-intl-black.svg',
        alt: 'Next-Intl',
        width: 130,
        height: 30,
        href: 'https://next-intl.dev/',
    },
    {
        darkSrc: '/images/brands/react-white.svg',
        lightSrc: '/images/brands/react-black.svg',
        alt: 'React',
        width: 33,
        height: 30,
        href: 'https://react.dev/',
    },
    {
        darkSrc: '/images/brands/authjs.svg',
        lightSrc: '/images/brands/authjs.svg',
        alt: 'Auth.js',
        width: 27,
        height: 30,
        href: 'https://authjs.dev/',
    },
    {
        darkSrc: '/images/brands/resend-white.svg',
        lightSrc: '/images/brands/resend-black.svg',
        alt: 'Resend',
        width: 30,
        height: 30,
        href: 'https://resend.com/',
    },
    {
        darkSrc: '/images/brands/lucide-white.svg',
        lightSrc: '/images/brands/lucide-black.svg',
        alt: 'Lucide-react',
        width: 30,
        height: 30,
        href: 'https://lucide.dev/',
    },
    {
        darkSrc: '/images/brands/zod.svg',
        lightSrc: '/images/brands/zod.svg',
        alt: 'Zod',
        width: 30,
        height: 30,
        href: 'https://zod.dev/',
    },
];

export const LibraryLogos = () => {
    return (
        <section className="bg-background border-border/50 overflow-hidden border-b pt-10 pb-15 md:pt-15">
            <div className="container mx-auto px-6">
                <div className="mb-12 text-center" style={{ opacity: 1, transform: 'none' }}>
                    <p className="text-muted-foreground mb-6 text-xs font-semibold tracking-wider uppercase">
                        Powered by Modern Technologies
                    </p>
                </div>
                <div className="relative">
                    <div className="from-background pointer-events-none absolute start-0 top-0 z-10 h-full w-20 bg-gradient-to-r to-transparent"></div>
                    <div className="from-background pointer-events-none absolute end-0 top-0 z-10 h-full w-20 bg-gradient-to-l to-transparent"></div>
                    <div className="group flex flex-row [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:2rem]">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-marquee flex shrink-0 flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]"
                                >
                                    {logos.map((logo, idx) => (
                                        <div
                                            key={logo.alt + i + idx}
                                            className="mx-8 flex flex-shrink-0 items-center gap-3 whitespace-nowrap opacity-50 transition-all duration-300"
                                        >
                                            <ThemedImage
                                                darkSrc={logo.darkSrc}
                                                lightSrc={logo.lightSrc}
                                                alt={logo.alt}
                                                width={logo.width}
                                                height={logo.height}
                                                href={logo.href}
                                                className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
