import { Suspense } from 'react';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default async function DashboardLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    console.log('Dashboard Layout Locale:', locale);
    return (
        <div className="h-screen bg-gray-100 dark:bg-neutral-900">
            <DashboardHeader>
                <DashboardBreadcrumb />
            </DashboardHeader>
            <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                <DashboardSidebar />
                <div className="flex-1 overflow-hidden px-5 md:pt-0 md:pr-5 md:pb-0 md:pl-0">
                    <main className="h-full rounded-2xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-zinc-950">
                        <ScrollArea className="h-full">
                            <div className="p-4 md:p-6">
                                <Suspense
                                    fallback={
                                        <div className="space-y-4">
                                            <Skeleton className="h-8 w-48" />
                                            <Skeleton className="h-96 w-full" />
                                        </div>
                                    }>
                                    {children}
                                </Suspense>
                            </div>
                        </ScrollArea>
                    </main>
                </div>
            </div>
        </div>
    );
}
