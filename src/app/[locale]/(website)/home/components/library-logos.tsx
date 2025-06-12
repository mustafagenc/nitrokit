import { getStroybookUrl } from '@/lib';
import { ThemedImage } from '@/components/shared/themed-image';

export const LibraryLogos = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="mb-10 flex flex-row flex-wrap items-center justify-center gap-8 lg:w-3xl">
                <ThemedImage
                    darkSrc="/images/brands/nextjs-white.svg"
                    lightSrc="/images/brands/nextjs-black.svg"
                    alt="Next.js"
                    width={150}
                    height={30}
                    href="https://nextjs.org/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/typescript.svg"
                    lightSrc="/images/brands/typescript.svg"
                    alt="Typescript"
                    width={36}
                    height={36}
                    href="https://www.typescriptlang.org/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/tailwindcss.svg"
                    lightSrc="/images/brands/tailwindcss.svg"
                    alt="Tailwind CSS"
                    width={50}
                    height={30}
                    href="https://tailwindcss.com/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/prisma-white.svg"
                    lightSrc="/images/brands/prisma-black.svg"
                    alt="Prisma"
                    width={100}
                    height={30}
                    href="https://www.prisma.io/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/radix-white.svg"
                    lightSrc="/images/brands/radix-black.svg"
                    alt="Radix-UI"
                    width={95}
                    height={30}
                    href="https://www.radix-ui.com/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/next-intl-white.svg"
                    lightSrc="/images/brands/next-intl-black.svg"
                    alt="Next-Intl"
                    width={130}
                    height={30}
                    href="https://next-intl.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
            </div>

            <div className="mb-10 flex min-w-2xl flex-row items-center justify-center gap-8">
                <ThemedImage
                    darkSrc="/images/brands/react-white.svg"
                    lightSrc="/images/brands/react-black.svg"
                    alt="React"
                    width={33}
                    height={30}
                    href="https://react.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/authjs.svg"
                    lightSrc="/images/brands/authjs.svg"
                    alt="Auth.js"
                    width={27}
                    height={30}
                    href="https://authjs.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/resend-white.svg"
                    lightSrc="/images/brands/resend-black.svg"
                    alt="Resend"
                    width={30}
                    height={30}
                    href="https://resend.com/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/lucide-white.svg"
                    lightSrc="/images/brands/lucide-black.svg"
                    alt="Lucide-react"
                    width={30}
                    height={30}
                    href="https://lucide.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
                <ThemedImage
                    darkSrc="/images/brands/zod.svg"
                    lightSrc="/images/brands/zod.svg"
                    alt="Zod"
                    width={30}
                    height={30}
                    href="https://zod.dev/"
                    className="drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
                />
            </div>
            <ThemedImage
                darkSrc="/images/brands/storybook-white.svg"
                lightSrc="/images/brands/storybook-black.svg"
                alt="Storybook"
                width={225}
                height={45}
                href={getStroybookUrl()}
                className="mt-6 drop-shadow-xs transition-transform duration-200 ease-in-out hover:scale-105"
            />
        </div>
    );
};
