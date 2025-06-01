import { Metadata } from 'next';

import { generatePageMetadata } from '@/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'My Invoices',
            description: 'This is the invoices page',
        }),
    });
}

export default async function Page() {
    return <div>My Invoices</div>;
}
