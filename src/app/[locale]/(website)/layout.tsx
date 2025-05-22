import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';

export default async function WebsiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
