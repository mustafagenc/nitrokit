'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MDXPreview } from '@/components/ui/mdx-preview';
import { TicketDetailsProps } from '@/types/ticket';

export function TicketDetails({ ticket }: TicketDetailsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{ticket.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm max-w-none">
                    <MDXPreview content={ticket.description} />
                </div>
            </CardContent>
        </Card>
    );
}
