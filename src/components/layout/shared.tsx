import { cn } from '@/lib';

export default async function SharedLayout({
    mainClassName,
    children,
    className,
    ...props
}: Readonly<{
    children: React.ReactNode;
    mainClassName?: string;
    className?: string;
}>) {
    return (
        <main className={cn('w-full', mainClassName)} {...props}>
            <div className={cn('w-full px-4 lg:mx-auto lg:w-7xl lg:p-0', className)}>
                {children}
            </div>
        </main>
    );
}
