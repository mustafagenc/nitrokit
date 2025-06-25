import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib';

export default function BackButton({ href, className }: { href?: string; className?: string }) {
    const t = useTranslations();
    return (
        <Link
            href={href ?? '/'}
            className={cn(
                'flex flex-row items-center justify-center gap-1 rounded-sm py-1 pr-6 pl-3 text-sm hover:underline hover:underline-offset-2',
                className
            )}
        >
            <ChevronLeft className="size-4" />
            {t(href ? 'common.goBack' : 'common.backToHome')}
        </Link>
    );
}
