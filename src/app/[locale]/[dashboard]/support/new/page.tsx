import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { NewTicketForm } from './components/new-ticket-form';

export const metadata: Metadata = {
    title: 'Yeni Destek Talebi',
    description: 'Yeni bir destek talebi oluşturun',
};

export default async function NewSupportPage({
    searchParams: _searchParams,
}: {
    searchParams: Promise<{
        category?: string;
        priority?: string;
    }>;
}) {
    const session = await auth();
    if (!session?.user) {
        redirect('/auth/login');
    }

    return (
        <div className="container mx-auto space-y-6 py-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Yeni Destek Talebi</h1>
                <p className="text-muted-foreground">
                    Lütfen destek talebinizle ilgili detayları doldurun
                </p>
            </div>

            <NewTicketForm />
        </div>
    );
}
