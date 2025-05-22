'use client';

import { CircleUserRound, HeartHandshake, ReceiptText } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import React from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandShortcut,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useHotkeys } from '@/hooks/useHotkeys';

import SmallLoading from '../shared/small-loading';
import { SignInButton } from './signin-button';
import { SignOutButton } from './signout-button';
import { SignUpButton } from './signup-button';

export default function UserAvatar() {
    const { data: session, status } = useSession();
    const [open, setOpen] = React.useState(false);

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
                onClick: () => console.log('Undo'),
            },
        });
    }

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
                <Avatar className="border-stroke ml-4 size-11 cursor-pointer border-1">
                    <AvatarImage src={session.user.image ?? undefined} />
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-0 shadow-xs" side="bottom" align="end">
                <div className="flex w-full flex-row items-start justify-start gap-3 p-3">
                    <div>
                        <Avatar className="border-stroke size-11 cursor-pointer border-1">
                            <AvatarImage src={session.user.image ?? undefined} />
                        </Avatar>
                    </div>
                    <div>
                        <h4 className="mt-2 text-xs font-semibold text-ellipsis text-gray-800 dark:text-white">
                            {session.user.name}
                        </h4>
                        <p className="text-xs font-normal text-ellipsis text-gray-600 dark:text-gray-400">
                            {session.user.email}
                        </p>
                    </div>
                </div>
                <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
                <div>
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                <CommandItem onSelect={() => ShowToast(t('auth.account'))}>
                                    <CircleUserRound />
                                    <span>{t('auth.account')}</span>
                                    <CommandShortcut>⌘J</CommandShortcut>
                                </CommandItem>
                                <CommandItem onSelect={() => ShowToast(t('auth.support'))}>
                                    <HeartHandshake />
                                    <span>{t('auth.support')}</span>
                                </CommandItem>
                                <CommandItem onSelect={() => ShowToast(t('auth.billing'))}>
                                    <ReceiptText />
                                    <span>{t('auth.billing')}</span>
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
