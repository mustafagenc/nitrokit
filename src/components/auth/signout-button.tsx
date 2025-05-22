import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export function SignOutButton() {
    const t = useTranslations('auth');
    return (
        <Button
            size={'sm'}
            className="text-primary w-full cursor-pointer border-1 bg-white p-2 text-xs shadow-2xs outline-hidden hover:bg-gray-100 dark:bg-black dark:hover:bg-black/60"
            onClick={() => signOut()}>
            <span>{t('signout')}</span>
        </Button>
    );
}
