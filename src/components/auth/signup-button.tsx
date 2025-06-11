import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export function SignUpButton() {
    const t = useTranslations('auth');
    return (
        <Button
            className="hidden bg-blue-600 hover:bg-blue-700 lg:inline-flex dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            onClick={() => (window.location.href = '/signup')}
        >
            <span>{t('signup.title')}</span>
        </Button>
    );
}
