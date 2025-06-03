import { LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Button } from '../ui/button';

export function SignInButton() {
    const t = useTranslations('auth');
    return (
        <Button variant={'ghost'} onClick={() => signIn()}>
            <LogIn />
            <span>{t('signin.title')}</span>
        </Button>
    );
}
