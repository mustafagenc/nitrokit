import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'Settings',
            description: 'This is the settings page',
        }),
    });
}

export default async function Page() {
    return <div>Settings</div>;
}
