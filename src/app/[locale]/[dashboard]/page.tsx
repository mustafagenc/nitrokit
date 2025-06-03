import { Metadata } from 'next';

import { generatePageMetadata } from '@/lib';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Dashboard',
            description: 'This is the dashboard page',
        }),
    });
}

export default async function Page() {
    return <div>Dashboard</div>;
}
