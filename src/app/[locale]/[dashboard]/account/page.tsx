import { Metadata } from 'next';

import { generatePageMetadata } from '@/utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Account Information',
            description: 'This is the account information page',
        }),
    });
}

export default async function Page() {
    return <div>Account Information</div>;
}
