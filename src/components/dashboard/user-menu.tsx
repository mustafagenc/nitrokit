'use client';

import {
    CircleUserRound,
    HeartHandshake,
    ReceiptText,
    User,
    Shield,
    Bell,
    Settings,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandShortcut,
    CommandSeparator,
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

export function UserMenu({ size = 'size-10' }: UserMenuProps) {
    const { data: session, status } = useSession();
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    const t = useTranslations();

    const handleNavigation = React.useCallback(
        (route: string) => {
            setOpen(false);
            router.push(route);
        },
        [router]
    );

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
                    handleNavigation('/dashboard/account');
                },
            },
            {
                key: 'p',
                metaKey: true,
                action: () => {
                    handleNavigation('/dashboard/account/profile');
                },
            },
            {
                key: 's',
                metaKey: true,
                action: () => {
                    handleNavigation('/dashboard/account/security');
                },
            },
        ],
        [handleNavigation]
    );

    useHotkeys(shortcuts, [shortcuts]);

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
            <PopoverContent className="w-62 p-0 shadow-xs" side="bottom" align="end">
                <div className="flex w-full flex-row items-center justify-start gap-3 p-4">
                    <div>
                        <UserAvatar
                            useSessionData={true}
                            size={size}
                            className="border-green-500"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="mt-2 truncate text-sm font-semibold text-gray-800 dark:text-white">
                            {getDisplayName()}
                        </h4>
                        <p className="truncate text-xs font-normal text-gray-600 dark:text-gray-400">
                            {session.user.email}
                        </p>
                    </div>
                    <div className="focus:ring-ring inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded-sm border border-blue-700/10 bg-blue-700/10 px-[0.325rem] text-[0.6875rem] leading-[0.75rem] font-medium text-blue-700 focus:ring-2 focus:ring-offset-2 focus:outline-hidden [&_svg]:-ms-px [&_svg]:size-3 [&_svg]:shrink-0">
                        {session.user.role || 'User'}
                    </div>
                </div>

                <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />

                <div>
                    <Command>
                        <CommandList>
                            <CommandGroup heading="Account">
                                <CommandItem
                                    onSelect={() => handleNavigation('/dashboard/account')}>
                                    <CircleUserRound className="mr-2 h-4 w-4" />
                                    <span>Account Overview</span>
                                    <CommandShortcut>⌘J</CommandShortcut>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => handleNavigation('/dashboard/account/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile Settings</span>
                                    <CommandShortcut>⌘P</CommandShortcut>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() =>
                                        handleNavigation('/dashboard/account/security')
                                    }>
                                    <Shield className="mr-2 h-4 w-4" />
                                    <span>Security</span>
                                    <CommandShortcut>⌘S</CommandShortcut>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() =>
                                        handleNavigation('/dashboard/account/notifications')
                                    }>
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Notifications</span>
                                </CommandItem>
                            </CommandGroup>

                            <CommandSeparator />

                            <CommandGroup heading="Other">
                                <CommandItem
                                    onSelect={() => handleNavigation('/dashboard/support')}>
                                    <HeartHandshake className="mr-2 h-4 w-4" />
                                    <span>{t('dashboard.navigation.support')}</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => handleNavigation('/dashboard/billing')}>
                                    <ReceiptText className="mr-2 h-4 w-4" />
                                    <span>Billing</span>
                                </CommandItem>
                                <CommandItem
                                    onSelect={() => handleNavigation('/dashboard/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>

                <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />

                {/* Sign Out */}
                <div className="p-3">
                    <SignOutButton />
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default UserMenu;
