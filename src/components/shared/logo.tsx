import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ThemedImage } from '@/components/shared/themed-image';

export default function Logo({
    size = 50,
    onlyIcon = false,
    forceText = false,
}: {
    size?: number;
    onlyIcon?: boolean;
    forceText?: boolean;
}) {
    const t = useTranslations('app');
    return (
        <Link href={'/'} className="flex items-center justify-start gap-2">
            <ThemedImage
                lightSrc={'/logo/ekipisi.svg'}
                darkSrc={'/logo/ekipisi-dark.svg'}
                alt="Next.js logo"
                width={size}
                height={size}
                className={`drop-shadow-xs`}
            />
            {!onlyIcon && (
                <span
                    className={`${forceText ? '' : 'hidden lg:inline-block'} bg-gradient-to-r from-blue-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% bg-clip-text font-[family-name:var(--font-lexend)] text-2xl font-bold text-transparent text-shadow-2xs`}>
                    {t('name')}
                </span>
            )}
        </Link>
    );
}
