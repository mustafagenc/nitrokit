import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TicketMessagesSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mesajlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="flex items-start gap-4 rounded-lg border p-4">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Skeleton className="h-8 w-32" />
                                    <Skeleton className="h-8 w-28" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <div className="flex justify-end">
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
