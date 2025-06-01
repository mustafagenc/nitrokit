import { Metadata } from 'next';

import { generatePageMetadata } from '@/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Support',
            description: 'This is the support page',
        }),
    });
}

export default async function Page() {
    return <div>Support</div>;
}
