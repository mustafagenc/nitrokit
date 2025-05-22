import { Link } from '@/i18n/navigation';
import { cn } from '@/utils/helpers';
import { ChevronRight } from 'lucide-react';

export const MiniBanner = ({
    href,
    badge,
    text,
    className,
}: {
    href: string;
    badge: string;
    text: string;
    className?: string;
}) => {
    return (
        <Link
            href={href}
            className={cn(
                'flex flex-row items-center justify-center gap-3 rounded-full bg-blue-500/40 px-2 py-1 text-sm text-emerald-900 shadow-xs transition ease-in-out hover:bg-blue-500/50 hover:text-white dark:bg-blue-500/20 dark:text-white dark:hover:bg-blue-500/30 dark:hover:text-white',
                className
            )}>
            <span className="rounded-xl bg-blue-700 px-3 py-1 font-bold text-white">{badge}</span>
            <span className="font-semibold">{text}</span>
            <ChevronRight size={16} />
        </Link>
    );
};
