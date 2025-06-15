import { TicketDetailsSkeleton } from './components/ticket-details-skeleton';
import { TicketMessagesSkeleton } from './components/ticket-messages-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function TicketLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between p-6">
                <div>
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="mt-2 h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <TicketDetailsSkeleton />
                    <TicketMessagesSkeleton />
                </div>
            </div>
        </div>
    );
}
