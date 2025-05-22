import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
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
                                    <span className="font-extrabold text-red-600">{children}</span>
                                ),
                            })}
                        </p>
                        <p>
                            {t.rich('auth.slogan2', {
                                link: children => (
                                    <a
                                        href="https://github.com/mustafagenc/nitrokit"
                                        target="_blank"
                                        className="text-blue-700 underline underline-offset-2 hover:text-blue-800">
                                        {children}
                                    </a>
                                ),
                            })}
                        </p>
                    </div>
                </div>
                <div className="mx-auto mt-30 grid w-xl grid-flow-col grid-rows-2 justify-items-center gap-20">
                    <div className="col-span-2">
                        <ThemedImage
                            lightSrc={'/images/brands/nextjs-black.svg'}
                            darkSrc={'/images/brands/nextjs-white.svg'}
                            alt="Next.js Logo"
                            width={200}
                            height={100}
                            className="drop-shadow-sm transition duration-300 ease-in-out hover:scale-110 dark:drop-shadow-md"
                        />
                    </div>
                    <div className="col-span-2 row-span-2">
                        <ThemedImage
                            lightSrc={'/images/brands/tailwindcss-logotype.svg'}
                            darkSrc={'/images/brands/tailwindcss-logotype-white.svg'}
                            alt="Tailwind CSS Logo"
                            width={200}
                            height={100}
                            className="drop-shadow-sm transition duration-300 ease-in-out hover:scale-110 dark:drop-shadow-md"
                        />
                    </div>
                    <div className="col-span-2">
                        <ThemedImage
                            lightSrc={'/images/brands/resend-wordmark-black.svg'}
                            darkSrc={'/images/brands/resend-wordmark-white.svg'}
                            alt="Resend Logo"
                            width={200}
                            height={100}
                            className="drop-shadow-sm transition duration-300 ease-in-out hover:scale-110 dark:drop-shadow-md"
                        />
                    </div>
                    <div className="col-span-2">
                        <Image
                            src={'/images/brands/prisma.svg'}
                            alt="grid"
                            width={100}
                            height={100}
                            className="col-span-1"
                        />
                    </div>
                    <div className="row-span-3">
                        <Image
                            src={'/images/brands/authjs.svg'}
                            alt="grid"
                            width={120}
                            height={120}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
