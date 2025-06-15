import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default function SupportLoading() {
    return (
        <div className="container mx-auto space-y-6 py-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="mt-2 h-5 w-64" />
                </div>
                <Button asChild disabled>
                    <Link href="/dashboard/support/new">
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Yeni Talep
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-4"
                    >
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-64" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}
