import { cn } from '@/utils/helpers';

export default async function SharedLayout({
    children,
    className,
    ...props
}: Readonly<{
    children: React.ReactNode;
    className?: string;
}>) {
    return (
        <main className="w-full" {...props}>
            <div className={cn('w-full px-4 lg:mx-auto lg:w-7xl lg:p-0', className)}>
                {children}
            </div>
        </main>
    );
}
