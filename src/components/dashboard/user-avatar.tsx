import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/helpers';

interface UserAvatarProps {
    src?: string | null;
    name?: string | null;
    size?: string;
    className?: string;
    fallbackClassName?: string;
}

export const UserAvatar = React.forwardRef<HTMLButtonElement, UserAvatarProps>(
    ({ src, name, size = 'size-11', className, fallbackClassName, ...props }, ref) => {
        const initials = name?.charAt(0)?.toUpperCase() || 'U';

        return (
            <Avatar
                ref={ref}
                className={cn(`border-stroke cursor-pointer border-1`, size, className)}
                {...props}>
                <AvatarImage src={src ?? undefined} alt={name ?? 'User'} />
                <AvatarFallback className={cn('bg-gray-200 dark:bg-gray-800', fallbackClassName)}>
                    {initials}
                </AvatarFallback>
            </Avatar>
        );
    }
);

UserAvatar.displayName = 'UserAvatar';
