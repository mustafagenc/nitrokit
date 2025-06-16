import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

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
                lightSrc={'/logo/nitrokit-dark.svg'}
                darkSrc={'/logo/nitrokit.svg'}
                alt="Next.js logo"
                width={size}
                height={size}
                className={'drop-shadow-xs'}
            />
            {!onlyIcon && (
                <span
                    className={`${forceText ? '' : 'hidden lg:inline-block'} font-[family-name:var(--font-lexend)] text-2xl font-bold text-shadow-2xs`}
                >
                    {t('name')}
                </span>
            )}
        </Link>
    );
}
