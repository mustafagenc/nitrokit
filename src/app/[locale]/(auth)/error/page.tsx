'use client';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function Page() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const getErrorMessage = (error: string | null) => {
        switch (error) {
            case 'Configuration':
                return 'There is a problem with the server configuration.';
            case 'AccessDenied':
                return 'Access denied. You do not have permission to sign in.';
            case 'Verification':
                return 'The verification token has expired or has already been used.';
            default:
                return 'An error occurred during authentication.';
        }
    };

    return (
        <div className="flex w-full flex-col items-center justify-center gap-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Authentication Error</h2>
                <p className="mt-2 text-gray-600">{getErrorMessage(error)}</p>
            </div>
            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link href="/signin">Try Again</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/">Go Home</Link>
                </Button>
            </div>
        </div>
    );
}
