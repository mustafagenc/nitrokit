'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

function filterLocaleSegments(segments: string[]) {
    const localePatterns = [
        /^[a-z]{2}$/, // en, tr, de, fr
        /^[a-z]{2}-[A-Z]{2}$/, // en-US, tr-TR, de-DE
        /^[a-z]{3}$/, // spa, fra
    ];
    return segments.filter((segment) => !localePatterns.some((pattern) => pattern.test(segment)));
}

export function DashboardBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const pathSegments = filterLocaleSegments(segments);
    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        const name = segment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return { name, href, isLast };
    });

    return (
        <nav className="hidden items-center justify-start space-x-1 text-sm lg:flex">
            {breadcrumbs.map((breadcrumb) => (
                <div key={breadcrumb.href} className="flex items-center space-x-1">
                    <ChevronRight className="h-3 w-3 text-gray-400 dark:text-zinc-500" />
                    {breadcrumb.isLast ? (
                        <span className="font-medium text-gray-900 dark:text-zinc-100">
                            {breadcrumb.name}
                        </span>
                    ) : (
                        <Link
                            href={breadcrumb.href}
                            className="rounded-lg px-2 py-1 text-gray-500 transition-colors hover:bg-white hover:text-gray-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        >
                            {breadcrumb.name}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
