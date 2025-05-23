import { GitHubIcon } from '@/components/icons/github';
import SharedLayout from '@/components/layout/shared';
import { ThemedImage } from '@/components/shared/themed-image';
import { MiniBanner } from '@/components/temp/mini-banner';
import { Link } from '@/i18n/navigation';

export default async function Home() {
    return (
        <SharedLayout
            mainClassName=" min-h-screen"
            className="flex flex-col items-center justify-center text-center">
            <MiniBanner
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
            <p className="mb-6 w-4xl text-lg leading-8 text-gray-800 text-shadow-2xs dark:text-gray-200">
                Nitrokit, startup&apos;ların hızlı ve etkili bir şekilde web sitelerini hayata
                geçirmeleri için tasarlanmış, gerekli tüm entegrasyonları, sayfaları ve bileşenleri
                barındıran bir başlangıç setidir.
            </p>

            <div className="mt-8 flex flex-row items-center justify-center gap-4">
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

            <div className="my-10">Bu projeye katkıda bulunan muhteşem kütüphaneler;</div>

            <div className="mb-10 flex min-w-3xl flex-row items-center justify-center gap-8">
                <ThemedImage
                    darkSrc="/images/brand-logo/nextjs-white.svg"
                    lightSrc="/images/brand-logo/nextjs-black.svg"
                    alt="Next.js"
                    width={150}
                    height={30}
                    href="https://nextjs.org/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/typescript.svg"
                    lightSrc="/images/brand-logo/typescript.svg"
                    alt="Typescript"
                    width={36}
                    height={36}
                    href="https://www.typescriptlang.org/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/tailwindcss.svg"
                    lightSrc="/images/brand-logo/tailwindcss.svg"
                    alt="Tailwind CSS"
                    width={50}
                    height={30}
                    href="https://tailwindcss.com/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/prisma-white.svg"
                    lightSrc="/images/brand-logo/prisma-black.svg"
                    alt="Prisma"
                    width={100}
                    height={30}
                    href="https://www.prisma.io/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/radix-white.svg"
                    lightSrc="/images/brand-logo/radix-black.svg"
                    alt="Radix-UI"
                    width={95}
                    height={30}
                    href="https://www.radix-ui.com/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/next-intl-white.svg"
                    lightSrc="/images/brand-logo/next-intl-black.svg"
                    alt="Next-Intl"
                    width={130}
                    height={30}
                    href="https://next-intl.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
            </div>

            <div className="mb-10 flex min-w-2xl flex-row items-center justify-center gap-8">
                <ThemedImage
                    darkSrc="/images/brand-logo/react-white.svg"
                    lightSrc="/images/brand-logo/react-black.svg"
                    alt="React"
                    width={33}
                    height={30}
                    href="https://react.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/authjs.svg"
                    lightSrc="/images/brand-logo/authjs.svg"
                    alt="Auth.js"
                    width={27}
                    height={30}
                    href="https://authjs.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/resend-white.svg"
                    lightSrc="/images/brand-logo/resend-black.svg"
                    alt="Resend"
                    width={30}
                    height={30}
                    href="https://resend.com/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/lucide-white.svg"
                    lightSrc="/images/brand-logo/lucide-black.svg"
                    alt="Lucide-react"
                    width={30}
                    height={30}
                    href="https://lucide.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brand-logo/zod.svg"
                    lightSrc="/images/brand-logo/zod.svg"
                    alt="Zod"
                    width={30}
                    height={30}
                    href="https://zod.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
            </div>
        </SharedLayout>
    );
}
