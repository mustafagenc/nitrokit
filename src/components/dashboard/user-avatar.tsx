'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib';
import { useSession } from 'next-auth/react';
import { useAvatar } from '@/contexts/avatar-context';

interface UserAvatarProps {
    src?: string | null;
    name?: string | null;
    size?: string;
    className?: string;
    fallbackClassName?: string;
    useSessionData?: boolean;
}

export const UserAvatar = React.forwardRef<HTMLButtonElement, UserAvatarProps>(
    (
        {
            src,
            name,
            size = 'size-11',
            className,
            fallbackClassName,
            useSessionData = false,
            ...props
        },
        ref
    ) => {
        const { data: session } = useSession();
        const { avatarUrl, initializeAvatar, forceUpdate } = useAvatar();
        const [displayName, setDisplayName] = useState<string | null>(null);

        useEffect(() => {
            if (useSessionData && session?.user?.image && !avatarUrl) {
                initializeAvatar(session.user.image);
            }
        }, [session?.user?.image, useSessionData, avatarUrl, initializeAvatar]);

        const getAvatarSrc = () => {
            if (useSessionData) {
                const contextAvatar = avatarUrl;
                const sessionAvatar = session?.user?.image;
                const propAvatar = src;
                return contextAvatar || sessionAvatar || propAvatar || null;
            }
            return src || null;
        };

        const avatarSrc = getAvatarSrc();

        useEffect(() => {
            if (useSessionData && session?.user) {
                setDisplayName(session.user.name || name || null);
            } else {
                setDisplayName(name || null);
            }
        }, [name, useSessionData, session]);

        const getInitials = () => {
            if (useSessionData && session?.user) {
                const firstName = session.user.firstName;
                const lastName = session.user.lastName;
                const fullName = session.user.name;

                if (firstName && lastName) {
                    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
                } else if (fullName) {
                    const names = fullName.split(' ');
                    if (names.length >= 2) {
                        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
                    }
                    return fullName.charAt(0).toUpperCase();
                } else if (session.user.email) {
                    return session.user.email.charAt(0).toUpperCase();
                }
            }

            return displayName?.charAt(0)?.toUpperCase() || 'U';
        };

        const initials = getInitials();

        return (
            <Avatar
                ref={ref}
                className={cn(`border-stroke cursor-pointer border-1`, size, className)}
                {...props}>
                <AvatarImage
                    src={avatarSrc ?? undefined}
                    alt={displayName ?? 'User'}
                    key={`${avatarSrc}-${forceUpdate}`}
                />
                <AvatarFallback className={cn('bg-gray-200 dark:bg-gray-800', fallbackClassName)}>
                    {initials}
                </AvatarFallback>
            </Avatar>
        );
    }
);

UserAvatar.displayName = 'UserAvatar';
