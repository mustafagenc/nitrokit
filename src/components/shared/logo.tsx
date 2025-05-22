import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ThemedImage } from '@/components/shared/themed-image';

export default function Logo({
    size = 50,
    onlyIcon = false,
}: {
    size?: number;
    onlyIcon?: boolean;
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
                <span className="hidden font-[family-name:var(--font-lexend)] text-2xl font-bold text-shadow-2xs lg:inline-block">
                    {t('name')}
                </span>
            )}
        </Link>
    );
}
