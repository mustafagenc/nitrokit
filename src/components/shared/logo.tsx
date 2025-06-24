import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/navigation';

import { ThemedImage } from '@/components/shared/themed-image';

export default function Logo({
    size = 40,
    onlyIcon = false,
    forceText = false,
}: {
    size?: number;
    onlyIcon?: boolean;
    forceText?: boolean;
}) {
    const t = useTranslations('app');
    return (
        <Link href={'/'} className="flex items-center justify-start gap-4">
            <ThemedImage
                lightSrc={'/logo/nitrokit-icon.png'}
                darkSrc={'/logo/nitrokit-icon.png'}
                alt="Next.js logo"
                width={size}
                height={size}
                className={'drop-shadow-xs'}
            />
            {!onlyIcon && (
                <span
                    className={`${forceText ? '' : 'hidden lg:inline-block'} font-[family-name:var(--font-montserrat)] text-3xl font-bold tracking-wide text-shadow-xs`}
                >
                    {t('name').toLowerCase()}
                </span>
            )}
        </Link>
    );
}
