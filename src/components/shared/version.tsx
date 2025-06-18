import { useVersion } from '@/hooks/useVersion';
import { Badge } from '@/components/ui/badge';
import { Suspense } from 'react';

export function Version() {
    const { version } = useVersion();

    return (
        <Suspense
            fallback={
                <Badge variant="outline" className="text-xs">
                    Loading...
                </Badge>
            }
        >
            <Badge variant="outline" className="text-xs">
                v{version}
            </Badge>
        </Suspense>
    );
}
