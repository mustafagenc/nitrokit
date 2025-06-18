'use client';

import { useTranslations } from 'next-intl';

import { Footer } from '@/components/footer/compact-footer';
import { Header } from '@/components/header/header';
import { Button } from '@/components/ui/button';

export default function Error({ reset }: { reset: () => void }) {
    const t = useTranslations('error');

    return (
        <>
            <Header />
            <div className="mb-20 grid min-h-96 place-content-center text-center">
                <h1 className="mb-10 text-2xl">{t('title')}</h1>
                <Button variant={'destructive'} onClick={reset}>
                    {t('retry')}
                </Button>
            </div>
            <Footer />
        </>
    );
}
