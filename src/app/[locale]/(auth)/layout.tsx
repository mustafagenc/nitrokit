import { getTranslations } from 'next-intl/server';
import { getLangDir } from 'rtl-detect';

import { LocaleSwitcher } from '@/components/header/locale-switcher';
import { ThemeToggle } from '@/components/header/theme-toggle';
import BackButton from '@/components/shared/back-button';
import Logo from '@/components/shared/logo';
import PoweredBy from '@/components/shared/powered-by';
import { ThemedImage } from '@/components/shared/themed-image';
import { Link } from '@/lib/i18n/navigation';

export default async function AuthLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    const direction = getLangDir(locale);
    const isRtl = direction === 'rtl';

    const t = await getTranslations();

    return (
        <div className="flex min-h-screen w-full flex-row items-center justify-between gap-6 p-6">
            <div
                className={`absolute top-5 z-20 flex w-[calc(100%-66px)] flex-row items-center justify-between gap-3 lg:max-w-2xs ${isRtl ? 'right-9' : 'left-9'}`}>
                <BackButton className="border-1 bg-white lg:border-0 dark:bg-transparent" />
                <div className="flex flex-row gap-4">
                    <LocaleSwitcher />
                    <ThemeToggle />
                </div>
            </div>
            <div className="mt-10 flex w-full flex-col items-center justify-between lg:mt-0">
                <div className="flex max-w-[400px] flex-col items-center justify-between">
                    <div className="relative flex flex-col items-center justify-center p-3 lg:mt-0">
                        <div className="flex w-full flex-col items-start justify-start gap-3 rounded-lg border-1 bg-white p-6 shadow-2xs dark:bg-gray-950">
                            {children}
                        </div>
                        <div className="flex max-w-[400px] flex-col items-center border-gray-100/70 p-3 text-xs text-gray-500 lg:w-7xl lg:flex-row lg:justify-between dark:border-gray-800/80 dark:text-gray-400">
                            <div>
                                <Link
                                    href={'/privacy'}
                                    className="text-blue-700 hover:underline hover:underline-offset-2"
                                    target="_blank">
                                    {t('auth.privacyPolicy')}
                                </Link>
                            </div>
                            <div className="mt-6 flex items-center gap-1 lg:mt-0">
                                <PoweredBy />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative hidden min-h-[calc(100vh-60px)] w-full cursor-default flex-col gap-4 rounded-lg border-1 bg-[url(/images/bg/19449741-70.png)] bg-cover bg-top-left bg-no-repeat p-3 shadow-2xs lg:flex dark:bg-[url(/images/bg/SL-122221-47450-01-70.png)]">
                <div className="mt-10 ml-10 grow">
                    <Logo />
                    <div className="text-md mt-5 ml-15 max-w-[400px] font-[family-name:var(--font-lexend)] leading-7">
                        <p>
                            {t.rich('auth.slogan1', {
                                span: children => (
                                    <span className="inline-block bg-gradient-to-r from-red-500 from-10% via-orange-500 via-30% to-red-500 to-90% bg-clip-text font-extrabold text-transparent">
                                        {children}
                                    </span>
                                ),
                            })}
                        </p>
                        <p>
                            {t.rich('auth.slogan2', {
                                link: children => (
                                    <a
                                        href="https://github.com/mustafagenc/nitrokit"
                                        target="_blank"
                                        className="inline-block bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text font-extrabold text-transparent underline underline-offset-2 hover:text-blue-800">
                                        {children}
                                    </a>
                                ),
                            })}
                        </p>
                    </div>
                </div>
                <div className="mx-auto mb-25 flex flex-row justify-items-center gap-10">
                    <ThemedImage
                        darkSrc="/images/brand-logo/nextjs-white.svg"
                        lightSrc="/images/brand-logo/nextjs-black.svg"
                        alt="Next.js"
                        width={150}
                        height={30}
                        href="https://nextjs.org/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/typescript.svg"
                        lightSrc="/images/brand-logo/typescript.svg"
                        alt="Typescript"
                        width={36}
                        height={36}
                        href="https://www.typescriptlang.org/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/tailwindcss.svg"
                        lightSrc="/images/brand-logo/tailwindcss.svg"
                        alt="Tailwind CSS"
                        width={50}
                        height={30}
                        href="https://tailwindcss.com/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/prisma-white.svg"
                        lightSrc="/images/brand-logo/prisma-black.svg"
                        alt="Prisma"
                        width={100}
                        height={30}
                        href="https://www.prisma.io/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/radix-white.svg"
                        lightSrc="/images/brand-logo/radix-black.svg"
                        alt="Radix-UI"
                        width={95}
                        height={30}
                        href="https://www.radix-ui.com/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/next-intl-white.svg"
                        lightSrc="/images/brand-logo/next-intl-black.svg"
                        alt="Next-Intl"
                        width={130}
                        height={30}
                        href="https://next-intl.dev/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                </div>
                <div className="mx-auto mb-50 flex min-w-2xl flex-row items-center justify-center gap-8">
                    <ThemedImage
                        darkSrc="/images/brand-logo/react-white.svg"
                        lightSrc="/images/brand-logo/react-black.svg"
                        alt="React"
                        width={53}
                        height={50}
                        href="https://react.dev/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/authjs.svg"
                        lightSrc="/images/brand-logo/authjs.svg"
                        alt="Auth.js"
                        width={47}
                        height={50}
                        href="https://authjs.dev/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/resend-white.svg"
                        lightSrc="/images/brand-logo/resend-black.svg"
                        alt="Resend"
                        width={50}
                        height={50}
                        href="https://resend.com/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/lucide-white.svg"
                        lightSrc="/images/brand-logo/lucide-black.svg"
                        alt="Lucide-react"
                        width={50}
                        height={50}
                        href="https://lucide.dev/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                    <ThemedImage
                        darkSrc="/images/brand-logo/zod.svg"
                        lightSrc="/images/brand-logo/zod.svg"
                        alt="Zod"
                        width={50}
                        height={50}
                        href="https://zod.dev/"
                        className="transition-transform duration-200 ease-in-out hover:scale-105"
                    />
                </div>
            </div>
        </div>
    );
}
