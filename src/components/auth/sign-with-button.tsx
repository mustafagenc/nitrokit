import { VariantProps } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import * as React from 'react';

import { signIn } from '@/lib/auth';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib';

type Provider = 'google' | 'github' | 'gitlab' | 'apple' | 'instagram' | 'facebook';

function getProviderDetail({ t, provider }: { t: (key: string) => string; provider: Provider }): {
    text: string;
    icon: string;
} {
    switch (provider) {
        case 'google':
            return {
                text: t('auth.signinWithGoogle'),
                icon: '/images/brands/google.svg',
            };
        case 'github':
            return {
                text: t('auth.signinWithGithub'),
                icon: '/images/brands/github.svg',
            };
        case 'gitlab':
            return {
                text: t('auth.signinWithGitlab'),
                icon: '/images/brands/gitlab.svg',
            };
        case 'apple':
            return {
                text: t('auth.signinWithApple'),
                icon: '/images/brands/apple.svg',
            };
        case 'instagram':
            return {
                text: t('auth.signinWithInstagram'),
                icon: '/images/brands/instagram.svg',
            };
        case 'facebook':
            return {
                text: t('auth.signinWithFacebook'),
                icon: '/images/brands/facebook.svg',
            };

        default:
            throw new Error('Unsupported provider');
    }
}

/**
 * SignInButton component
 * @param {Provider} provider - The provider for sign-in (e.g., 'google', 'github').
 * @param {string} className - Additional class names for styling.
 * @param {string} variant - Variant of the button (default, outline, etc.).
 * @param {string} size - Size of the button (sm, lg, etc.).
 * @param {boolean} asChild - If true, renders as a child component.
 * @param {object} props - Additional props to pass to the button.
 */
function SignWithButton({
    provider,
    className,
    variant,
    size,
    onlyIcon = false,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        provider: Provider;
        onlyIcon?: boolean;
        asChild?: boolean;
    }) {
    const t = useTranslations();
    const { text, icon } = getProviderDetail({ t, provider });

    return (
        <form
            action={async () => {
                'use server';
                await signIn(provider, { redirectTo: '/dashboard' });
            }}
        >
            <Button
                type="submit"
                aria-label={text}
                asChild={asChild}
                className={cn(
                    'w-full items-center justify-center border-1 border-gray-300 bg-white hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-950',
                    className
                )}
                variant={variant}
                size={size}
                {...props}
            >
                <Image src={icon} alt="Github" width={18} height={18} className="h-5 w-5" />
                <span
                    className={`text-sm text-black dark:text-gray-400 ${onlyIcon ? 'hidden' : ''}`}
                >
                    {text}
                </span>
            </Button>
        </form>
    );
}

export { SignWithButton };
