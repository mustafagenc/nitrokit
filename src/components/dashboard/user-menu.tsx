'use client';

import {
    CircleUserRound,
    HeartHandshake,
    ReceiptText,
    User,
    Shield,
    Bell,
    Settings,
    Key,
    Smartphone,
    Monitor,
    ChevronRight,
    LucideIcon,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useHotkeys } from '@/hooks/useHotkeys';

import SmallLoading from '@/components/shared/small-loading';
import { SignInButton } from '@/components/auth/signin-button';
import { SignOutButton } from '@/components/auth/signout-button';
import { SignUpButton } from '@/components/auth/signup-button';

import { useRouter } from '@/lib/i18n/navigation';
import { UserAvatar } from '@/components/dashboard/user-avatar';
import { cn } from '@/lib';

interface UserMenuProps {
    size?: string;
}

interface MenuItemProps {
    icon: LucideIcon;
    children: React.ReactNode;
    onClick?: () => void;
    shortcut?: string;
    className?: string;
}

export function UserMenu({ size = 'size-10' }: UserMenuProps) {
    const { data: session, status } = useSession();
    const [open, setOpen] = React.useState(false);
    const [securityOpen, setSecurityOpen] = React.useState(false);
    const router = useRouter();

    const t = useTranslations();

    const handleNavigation = React.useCallback(
        (route: string) => {
            setOpen(false);
            setSecurityOpen(false);
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
                    setOpen((prevOpen) => !prevOpen);
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

    const MenuItem = ({
        icon: Icon,
        children,
        onClick,
        shortcut,
        className = '',
    }: MenuItemProps) => (
        <button
            onClick={onClick}
            className={cn(
                'flex w-full items-center gap-2.5 px-2.5 py-1.5 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
                className
            )}
        >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 text-left">{children}</span>
            {shortcut && (
                <span className="text-xs text-gray-500 dark:text-gray-400">{shortcut}</span>
            )}
        </button>
    );

    const SecurityMenuItem = () => (
        <Popover open={securityOpen} onOpenChange={setSecurityOpen}>
            <PopoverTrigger asChild>
                <button className="flex w-full items-center gap-2.5 px-2.5 py-1.5 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Shield className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 text-left">Security</span>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </button>
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-52 p-1.5" sideOffset={8}>
                <div className="space-y-0.5">
                    <MenuItem
                        icon={Shield}
                        onClick={() => handleNavigation('/dashboard/account/security')}
                    >
                        Security Overview
                    </MenuItem>

                    <div className="my-1.5 h-px bg-gray-200 dark:bg-gray-700" />

                    <MenuItem
                        icon={Key}
                        onClick={() => handleNavigation('/dashboard/account/security/password')}
                    >
                        Password
                    </MenuItem>
                    <MenuItem
                        icon={Smartphone}
                        onClick={() => handleNavigation('/dashboard/account/security/two-factor')}
                    >
                        Two-Factor Auth
                    </MenuItem>
                    <MenuItem
                        icon={Monitor}
                        onClick={() => handleNavigation('/dashboard/account/security/sessions')}
                    >
                        Active Sessions
                    </MenuItem>
                </div>
            </PopoverContent>
        </Popover>
    );

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
            <PopoverContent className="w-62 p-0 shadow-lg" side="bottom" align="end">
                <div className="flex w-full flex-row items-center justify-start gap-3 border-b border-gray-200 p-3 dark:border-gray-700">
                    <div>
                        <UserAvatar
                            useSessionData={true}
                            size={size}
                            className="border-2 border-green-500"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                            {getDisplayName()}
                        </h4>
                        <p className="truncate text-xs font-normal text-gray-600 dark:text-gray-400">
                            {session.user.email}
                        </p>
                    </div>
                    <div className="flex h-6 min-w-6 items-center justify-center rounded border border-blue-200 bg-blue-50 px-2 text-xs font-medium text-blue-700 normal-case dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {session.user.role || 'User'}
                    </div>
                </div>

                <div className="p-1.5">
                    <div className="mb-3">
                        <div className="mb-1.5 px-2 py-1">
                            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Account
                            </h3>
                        </div>
                        <div className="space-y-0.5">
                            <MenuItem
                                icon={CircleUserRound}
                                onClick={() => handleNavigation('/dashboard/account')}
                                shortcut="⌘J"
                            >
                                Account Overview
                            </MenuItem>
                            <MenuItem
                                icon={User}
                                onClick={() => handleNavigation('/dashboard/account/profile')}
                                shortcut="⌘P"
                            >
                                Profile Settings
                            </MenuItem>
                            <SecurityMenuItem />
                            <MenuItem
                                icon={Bell}
                                onClick={() => handleNavigation('/dashboard/account/notifications')}
                            >
                                Notifications
                            </MenuItem>
                        </div>
                    </div>

                    <div className="my-2 h-px bg-gray-200 dark:bg-gray-700" />

                    <div className="mb-3">
                        <div className="mb-1.5 px-2 py-1">
                            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Other
                            </h3>
                        </div>
                        <div className="space-y-0.5">
                            <MenuItem
                                icon={HeartHandshake}
                                onClick={() => handleNavigation('/dashboard/support')}
                            >
                                {t('dashboard.navigation.support')}
                            </MenuItem>
                            <MenuItem
                                icon={ReceiptText}
                                onClick={() => handleNavigation('/dashboard/billing')}
                            >
                                Billing & Plans
                            </MenuItem>
                            <MenuItem
                                icon={Settings}
                                onClick={() => handleNavigation('/dashboard/settings')}
                            >
                                Settings
                            </MenuItem>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 p-2 dark:border-gray-700">
                    <SignOutButton />
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default UserMenu;
