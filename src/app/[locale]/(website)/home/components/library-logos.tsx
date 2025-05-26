import { getStroybookUrl } from '@/utils/helpers';
import { ThemedImage } from '@/components/shared/themed-image';

export const LibraryLogos = () => {
    return (
        <>
            <div className="my-10">Bu projeye katkıda bulunan muhteşem kütüphaneler;</div>

            <div className="mb-10 flex flex-row flex-wrap items-center justify-center gap-8 lg:w-3xl">
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
            <ThemedImage
                darkSrc="/images/brand-logo/storybook-white.svg"
                lightSrc="/images/brand-logo/storybook-black.svg"
                alt="Storybook"
                width={225}
                height={45}
                href={getStroybookUrl()}
                className="mt-6 drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
            />
        </>
    );
};
