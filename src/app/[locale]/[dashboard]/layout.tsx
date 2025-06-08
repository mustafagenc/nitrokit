import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { DashboardBreadcrumb } from '@/components/dashboard/breadcrumb';
import { requireAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import DashboardProvider from '@/providers/dashboard-provider';

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await requireAuth();

    if (!session) {
        redirect('/signin?callbackUrl=/dashboard');
    }
    return (
        <DashboardProvider>
            <div className="h-screen bg-gray-100 dark:bg-neutral-900">
                <DashboardHeader>
                    <DashboardBreadcrumb />
                </DashboardHeader>
                <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
                    <DashboardSidebar />
                    <div className="flex-1 overflow-hidden px-5 md:pt-0 md:pr-5 md:pb-0 md:pl-0">
                        <main className="h-full rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-zinc-950">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </DashboardProvider>
    );
}
