'use client';

import { CircleUserRound, HeartHandshake, ReceiptText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'sonner';

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandShortcut,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useHotkeys } from '@/hooks/useHotkeys';

import SmallLoading from '@/components/shared/small-loading';
import { SignInButton } from '@/components/auth/signin-button';
import { SignOutButton } from '@/components/auth/signout-button';
import { SignUpButton } from '@/components/auth/signup-button';

import { useRouter } from '@/lib/i18n/navigation';
import { UserAvatar } from '@/components/dashboard/user-avatar';

interface UserMenuProps {
    size?: string;
}

export function UserMenu({ size = 'size-11' }: UserMenuProps) {
    const { data: session, status } = useSession();
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    const t = useTranslations();

    const shortcuts = React.useMemo(
        () => [
            {
                key: 'e',
                metaKey: true,
                action: () => {
                    setOpen(prevOpen => !prevOpen);
                },
            },
            {
                key: 'j',
                metaKey: true,
                action: () => {
                    ShowToast(t('auth.account') + ' via shortcut');
                },
            },
        ],
        [t]
    );

    useHotkeys(shortcuts, [t]);

    function ShowToast(key: string) {
        toast(`Clicked ${key}`, {
            description: new Date().toLocaleString(),
            action: {
                label: 'Undo',
                onClick: () => toast.dismiss(),
            },
        });
    }

    function handleNavigation(route: string) {
        setOpen(false);
        router.push(route);
    }

    const getDisplayName = () => {
        if (session?.user?.firstName && session?.user?.lastName) {
            return `${session.user.firstName} ${session.user.lastName}`;
        }
        return session?.user?.name || 'User';
    };

    if (status === 'unauthenticated') {
        return (
            <div className="flex items-center gap-2 lg:ml-4">
                <SignInButton />
                <SignUpButton />
            </div>
        );
    }

    if (status === 'loading') {
        return <SmallLoading />;
    }

    if (!session?.user) return null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <UserAvatar useSessionData={true} size={size} className="ml-4" />
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0 shadow-xs" side="bottom" align="end">
                <div className="flex w-full flex-row items-start justify-start gap-3 p-3">
                    <div>
                        <UserAvatar useSessionData={true} size={size} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="mt-2 truncate text-xs font-semibold text-gray-800 dark:text-white">
                            {getDisplayName()}
                        </h4>
                        <p className="truncate text-xs font-normal text-gray-600 dark:text-gray-400">
                            {session.user.email}
                        </p>
                    </div>
                </div>
                <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
                <div>
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                <CommandItem
                                    onSelect={() => handleNavigation('/dashboard/account')}>
                                    <CircleUserRound />
                                    <span>{t('dashboard.navigation.account')}</span>
                                    <CommandShortcut>⌘J</CommandShortcut>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => handleNavigation('/dashboard/support')}>
                                    <HeartHandshake />
                                    <span>{t('dashboard.navigation.support')}</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => handleNavigation('/dashboard/invoices')}>
                                    <ReceiptText />
                                    <span>{t('dashboard.navigation.billing')}</span>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
                <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
                <div className="p-3">
                    <SignOutButton />
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default UserMenu;
