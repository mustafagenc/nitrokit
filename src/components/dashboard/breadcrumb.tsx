'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function DashboardBreadcrumb() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);
    const pathSegments = segments.filter(segment => !['en', 'tr'].includes(segment));

    const breadcrumbs = pathSegments.map((segment, index) => {
        const href = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;

        const name = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return { name, href, isLast };
    });

    return (
        <nav className="hidden items-center justify-start space-x-1 text-xs lg:flex">
            {breadcrumbs.map(breadcrumb => (
                <div key={breadcrumb.href} className="flex items-center space-x-1">
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    {breadcrumb.isLast ? (
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {breadcrumb.name}
                        </span>
                    ) : (
                        <Link
                            href={breadcrumb.href}
                            className="rounded-lg px-2 py-1 text-gray-500 transition-colors hover:bg-white hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                            {breadcrumb.name}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
