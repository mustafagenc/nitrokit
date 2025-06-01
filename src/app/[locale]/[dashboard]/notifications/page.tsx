import { Metadata } from 'next';

import { generatePageMetadata } from '@/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Notifications',
            description: 'This is the notifications page',
        }),
    });
}

export default async function Page() {
    return <div>Notifications</div>;
}
