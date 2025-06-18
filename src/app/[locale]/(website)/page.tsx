import SharedLayout from '@/components/layout/shared';
import { CompactBanner } from '@/components/banners/compact-banner';
import { Link } from '@/i18n/navigation';
import { LibraryLogos } from './home/components/library-logos';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink } from 'lucide-react';
import { GithubButtonWithStats } from '@/components/buttons/github-button-with-stats';
import { VercelDeployButton } from '@/components/buttons/vercel-deploy-button';
import { GITHUB_URL } from '@/constants/site';
import { useTranslations } from 'next-intl';
import { Testimonials } from './home/components/testimonials';
import { testimonials } from '@/constants/demo';

export default function Home() {
    const t = useTranslations('home');

    return (
        <div className="relative min-h-screen overflow-hidden bg-white transition-colors duration-300 dark:bg-[#111113]">
            <div className="absolute inset-0 overflow-hidden dark:hidden">
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                    }}
                />
                <div className="absolute top-10 -right-50 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 opacity-80 blur-3xl" />
                <div className="absolute top-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 opacity-70 blur-3xl" />
                <div className="absolute right-1/4 bottom-20 h-48 w-48 rounded-full bg-gradient-to-br from-purple-200 to-pink-300 opacity-60 blur-3xl" />
                <div className="absolute top-1/4 left-1/4 h-3 w-3 rotate-45 bg-blue-400 opacity-40" />
                <div className="absolute top-1/2 right-1/3 h-4 w-4 rotate-12 bg-emerald-400 opacity-45" />
                <div className="absolute bottom-1/3 left-1/2 h-2 w-2 rotate-45 bg-purple-400 opacity-35" />
                <div className="absolute top-32 right-1/2 h-1 w-16 bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />
                <div className="absolute bottom-1/4 left-1/4 h-12 w-1 bg-gradient-to-b from-transparent via-emerald-300/30 to-transparent" />
                <div className="absolute top-1/5 right-1/5 h-2 w-2 animate-pulse rounded-full bg-blue-300 opacity-50" />
                <div
                    className="absolute right-2/3 bottom-1/3 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300 opacity-40"
                    style={{ animationDelay: '1.5s' }}
                />
                <div
                    className="absolute top-2/3 left-1/5 h-1 w-1 animate-pulse rounded-full bg-purple-300 opacity-30"
                    style={{ animationDelay: '3s' }}
                />
            </div>
            <div className="absolute inset-0 hidden overflow-hidden dark:block">
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                    }}
                />
                <div className="absolute top-22 -right-42 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl" />
                <div className="absolute top-1/4 -left-24 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 blur-3xl" />
                <div className="absolute right-1/3 bottom-32 h-56 w-56 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl" />
                <div className="absolute top-1/3 left-1/4 h-1 w-1 animate-pulse bg-emerald-400 opacity-60" />
                <div
                    className="absolute top-1/2 right-1/4 h-1.5 w-1.5 animate-pulse bg-blue-400 opacity-50"
                    style={{ animationDelay: '1s' }}
                />
                <div
                    className="absolute bottom-1/2 left-1/3 h-1 w-1 animate-pulse bg-purple-400 opacity-40"
                    style={{ animationDelay: '2s' }}
                />
                <div className="absolute top-20 left-1/2 h-px w-32 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <div className="absolute right-1/4 bottom-40 h-24 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
            </div>
            <div className="relative z-10">
                <SharedLayout className="relative">
                    <div className="container mx-auto px-4 py-16 lg:py-10">
                        <div className="mb-12 text-center">
                            <CompactBanner
                                href={`${GITHUB_URL}/releases`}
                                badge={t('banner.badge')}
                                text={t('banner.text')}
                                className="inline-flex border border-gray-200 bg-gray-50/80 backdrop-blur-sm transition-colors hover:bg-gray-100/80 dark:border-gray-800 dark:bg-gray-900/80 dark:hover:bg-gray-800/80"
                            />
                        </div>

                        <div className="mx-auto mb-16 max-w-4xl text-center">
                            <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                                <span className="mb-6 inline-block bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-center text-6xl leading-19 font-bold text-transparent text-shadow-xs">
                                    {t('hero.title.primary')}
                                </span>
                                <span className="mb-6 block bg-gradient-to-r text-center font-bold text-emerald-500 text-shadow-xs">
                                    {t('hero.title.secondary')}
                                </span>
                            </h1>

                            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl dark:text-gray-300">
                                {t('hero.subtitle')}
                            </p>

                            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <VercelDeployButton />
                                <GithubButtonWithStats />
                            </div>
                        </div>

                        <div className="mx-auto mb-20 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="rounded-xl bg-white/50 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/70 dark:bg-gray-900/50 dark:hover:bg-gray-900/70">
                                <div className="mb-2 text-3xl font-bold text-blue-600 md:text-4xl dark:text-blue-400">
                                    {t('stats.components.number')}
                                </div>
                                <div className="font-medium text-gray-600 dark:text-gray-400">
                                    {t('stats.components.label')}
                                </div>
                            </div>

                            <div className="rounded-xl bg-white/50 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/70 dark:bg-gray-900/50 dark:hover:bg-gray-900/70">
                                <div className="mb-2 text-3xl font-bold text-emerald-600 md:text-4xl dark:text-emerald-400">
                                    {t('stats.typescript.number')}
                                </div>
                                <div className="font-medium text-gray-600 dark:text-gray-400">
                                    {t('stats.typescript.label')}
                                </div>
                            </div>

                            <div className="rounded-xl bg-white/50 p-6 text-center backdrop-blur-sm transition-all hover:bg-white/70 dark:bg-gray-900/50 dark:hover:bg-gray-900/70">
                                <div className="mb-2 text-3xl font-bold text-purple-600 md:text-4xl dark:text-purple-400">
                                    {t('stats.modern.number')}
                                </div>
                                <div className="font-medium text-gray-600 dark:text-gray-400">
                                    {t('stats.modern.label')}
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
                                {t('technologies.title')}
                            </h2>

                            <div className="inline-block rounded-2xl border border-gray-200/80 bg-white/60 p-8 backdrop-blur-sm dark:border-gray-800/80 dark:bg-gray-900/60">
                                <LibraryLogos />
                            </div>
                        </div>
                        <div className="mt-20 rounded-2xl border-t border-gray-200/50 bg-gradient-to-r from-white/40 via-white/60 to-white/40 pt-12 text-center backdrop-blur-sm dark:border-gray-800/50 dark:from-gray-900/40 dark:via-gray-900/60 dark:to-gray-900/40">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                {t('cta.title')}
                            </h3>
                            <p className="mb-6 text-gray-600 dark:text-gray-400">
                                {t('cta.description')}
                            </p>

                            <div className="flex flex-col items-center justify-center gap-3 pb-8 sm:flex-row">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/70 backdrop-blur-sm hover:bg-white dark:bg-gray-900/70 dark:hover:bg-gray-900"
                                >
                                    <Link href={GITHUB_URL}>
                                        <Github className="mr-2 h-4 w-4" />
                                        {t('cta.github')}
                                    </Link>
                                </Button>

                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-white/50 dark:hover:bg-gray-900/50"
                                >
                                    <Link href={GITHUB_URL + '/wiki'}>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        {t('cta.docs')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </SharedLayout>

                <Testimonials
                    title="Müşteri Görüşleri"
                    subtitle="Binlerce Kullanıcı Tarafından Seviliyor"
                    description="NitroKit'in neden bu kadar sevildiğini keşfedin ve bugün katılarak işiniz için dönüştürücü gücünü deneyimleyin."
                    testimonials={testimonials}
                />
            </div>
        </div>
    );
}
