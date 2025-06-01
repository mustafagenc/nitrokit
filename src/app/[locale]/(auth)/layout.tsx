import { getTranslations } from 'next-intl/server';
import { getLangDir } from 'rtl-detect';

import { ThemeToggle } from '@/components/theme/theme-toggle';
import BackButton from '@/components/shared/back-button';
import Logo from '@/components/shared/logo';
import PoweredBy from '@/components/shared/powered-by';
import { ThemedImage } from '@/components/shared/themed-image';
import { Link } from '@/lib/i18n/navigation';
import { CompactLocaleSwitcher } from '@/components/locale/compact-locale-switcher';

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
                className={`absolute top-5 z-20 flex w-[calc(100%-66px)] flex-row items-center justify-between gap-3 lg:max-w-xs ${isRtl ? 'right-9' : 'left-9'}`}>
                <BackButton className="border-1 bg-white lg:border-0 dark:bg-transparent" />
                <div className="flex flex-row gap-4">
                    <CompactLocaleSwitcher />
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

            <div className="relative hidden min-h-[calc(100vh-60px)] w-full cursor-default flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 bg-white lg:flex dark:border-gray-800 dark:bg-gray-950">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-50/30 to-pink-100/40 dark:hidden"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent_50%)] dark:hidden"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,182,193,0.3),transparent_50%)] dark:hidden"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(173,216,230,0.3),transparent_50%)] dark:hidden"></div>

                    <div className="absolute inset-0 hidden bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 dark:block"></div>
                    <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.15),transparent_50%)] dark:block"></div>
                    <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_50%)] dark:block"></div>
                    <div className="absolute inset-0 hidden bg-[radial-gradient(circle_at_40%_80%,rgba(236,72,153,0.15),transparent_50%)] dark:block"></div>
                </div>

                <div className="absolute inset-0 overflow-hidden">
                    <div className="animate-float absolute top-1/4 left-1/4 h-4 w-4 rounded-full bg-blue-300/60 dark:hidden"></div>
                    <div className="animate-float-delay-1 absolute top-3/4 right-1/4 h-3 w-3 rounded-full bg-purple-300/60 dark:hidden"></div>
                    <div className="animate-float-delay-2 absolute top-1/2 right-1/3 h-2 w-2 rounded-full bg-pink-300/60 dark:hidden"></div>
                    <div className="animate-float-delay-3 absolute bottom-1/4 left-1/3 h-5 w-5 rounded-full bg-indigo-300/60 dark:hidden"></div>

                    <div className="animate-float absolute top-1/4 left-1/4 hidden h-4 w-4 rounded-full bg-cyan-400/40 shadow-lg shadow-cyan-400/20 dark:block"></div>
                    <div className="animate-float-delay-1 absolute top-3/4 right-1/4 hidden h-3 w-3 rounded-full bg-purple-400/40 shadow-lg shadow-purple-400/20 dark:block"></div>
                    <div className="animate-float-delay-2 absolute top-1/2 right-1/3 hidden h-2 w-2 rounded-full bg-pink-400/40 shadow-lg shadow-pink-400/20 dark:block"></div>
                    <div className="animate-float-delay-3 absolute bottom-1/4 left-1/3 hidden h-5 w-5 rounded-full bg-blue-400/40 shadow-lg shadow-blue-400/20 dark:block"></div>
                </div>

                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 h-16 w-16 rotate-12 animate-pulse rounded-lg border border-blue-200/30 dark:hidden"></div>
                    <div className="animate-spin-slow absolute bottom-32 left-16 h-12 w-12 rounded-full border border-purple-200/30 dark:hidden"></div>
                    <div className="absolute top-1/2 left-20 h-8 w-8 rotate-45 animate-pulse border border-pink-200/30 dark:hidden"></div>
                    <div className="animate-float absolute right-1/3 bottom-20 h-20 w-20 rotate-6 rounded-xl border-2 border-indigo-200/20 dark:hidden"></div>
                    <div className="absolute top-20 right-20 hidden h-16 w-16 rotate-12 animate-pulse rounded-lg border border-cyan-400/30 shadow-lg shadow-cyan-400/10 dark:block"></div>
                    <div className="animate-spin-slow absolute bottom-32 left-16 hidden h-12 w-12 rounded-full border border-purple-400/30 shadow-lg shadow-purple-400/10 dark:block"></div>
                    <div className="absolute top-1/2 left-20 hidden h-8 w-8 rotate-45 animate-pulse border border-pink-400/30 shadow-lg shadow-pink-400/10 dark:block"></div>
                    <div className="animate-float absolute right-1/3 bottom-20 hidden h-20 w-20 rotate-6 rounded-xl border-2 border-blue-400/20 shadow-lg shadow-blue-400/10 dark:block"></div>
                </div>

                {/* Dot Grid Pattern 1 */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.15)_1px,transparent_1px)] bg-[size:12px_12px] dark:bg-[linear-gradient(to_right,rgba(59,130,246,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.25)_1px,transparent_1px)]"></div>
                </div>

                <div className="relative z-10 mt-10 ml-10 grow">
                    <div className="w-fit p-6">
                        <Logo />
                    </div>
                    <div className="text-md mt-8 ml-4 max-w-[400px] p-6 font-[family-name:var(--font-lexend)] leading-7">
                        <p className="text-gray-800 dark:text-gray-100">
                            {t.rich('auth.slogan1', {
                                span: children => (
                                    <span className="inline-block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text font-extrabold text-transparent">
                                        {children}
                                    </span>
                                ),
                            })}
                        </p>
                        <p className="text-gray-700 dark:text-gray-200">
                            {t.rich('auth.slogan2', {
                                link: children => (
                                    <a
                                        href="https://github.com/mustafagenc/nitrokit"
                                        target="_blank"
                                        className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 bg-clip-text font-extrabold text-transparent underline underline-offset-2 transition-all duration-300 hover:scale-105">
                                        {children}
                                    </a>
                                ),
                            })}
                        </p>
                    </div>
                </div>

                <div className="relative z-10 mx-auto mb-8 flex flex-row justify-items-center gap-6 p-6">
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

                <div className="relative z-10 mx-auto mb-42 flex min-w-2xl flex-row items-center justify-center gap-8 p-6">
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
