import { GitHubIcon } from '@/components/icons/github';
import SharedLayout from '@/components/layout/shared';
import { CompactBanner } from '@/components/banners/compact-banner';
import { Link } from '@/i18n/navigation';
import { LibraryLogos } from './home/components/library-logos';

export default async function Home() {
    return (
        <SharedLayout
            mainClassName=" min-h-screen"
            className="flex flex-col items-center justify-center text-center">
            <CompactBanner
                href="https://github.com/mustafagenc/nitrokit/releases"
                badge="New"
                text="v2.0.1 is out! See what's new"
                className="my-10"
            />
            <h1 className="mb-6 inline-block bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text text-center text-6xl leading-19 font-bold text-transparent dark:text-shadow-2xs">
                Nitrokit ile Tanışın:
            </h1>
            <h2 className="mb-6 inline-block bg-gradient-to-r text-center text-4xl font-bold text-emerald-500 dark:text-shadow-2xs">
                Geliştirme Süreçlerinizi Hızlandırın
            </h2>
            <p className="mb-6 text-lg leading-8 text-gray-800 text-shadow-2xs lg:w-4xl dark:text-gray-200">
                Nitrokit, startup&apos;ların hızlı ve etkili bir şekilde web sitelerini hayata
                geçirmeleri için tasarlanmış, gerekli tüm entegrasyonları, sayfaları ve bileşenleri
                barındıran bir başlangıç setidir.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 lg:flex-row">
                <Link
                    href="https://github.com/mustafagenc/nitrokit"
                    className="mb-6 rounded-md bg-blue-600 px-6 py-3 font-semibold text-white transition ease-out hover:bg-blue-600/90 hover:shadow-2xl hover:shadow-blue-600">
                    Hemen Kullanmaya Başlayın
                </Link>
                <Link
                    href="https://github.com/mustafagenc/nitrokit/stargazers"
                    className="mb-6 flex flex-row gap-2 rounded-md bg-gray-200 px-6 py-3 font-semibold text-black transition ease-out hover:bg-blue-600 hover:text-white hover:shadow-2xl hover:shadow-blue-600">
                    <GitHubIcon className="size-6" /> <span>Favorilere Ekle</span>
                </Link>
            </div>

            <LibraryLogos />
        </SharedLayout>
    );
}
