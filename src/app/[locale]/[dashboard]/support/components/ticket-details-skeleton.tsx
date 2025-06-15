import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TicketDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Destek Talebi Detayları</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Skeleton className="h-6 w-3/4" />
                        <div className="mt-2 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="mb-2 h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>

                        <div>
                            <Skeleton className="mb-2 h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="mb-2 h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                        </div>

                        <div>
                            <Skeleton className="mb-2 h-4 w-16" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
