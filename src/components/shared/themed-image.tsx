'use client';

import Image from 'next/image';

import { ThemedImageProps } from '@/types/ThemedImageProps';
import { cn } from '@/utils/helpers';

export const ThemedImage = ({
    lightSrc,
    darkSrc,
    alt,
    width,
    height,
    className,
    href,
    ...rest
}: ThemedImageProps) => {
    return (
        <>
            <Image
                src={lightSrc}
                alt={alt}
                width={width}
                height={height}
                className={cn(`dark:hidden ${href ? 'cursor-pointer' : ''}`, className)}
                {...rest}
                onClick={() => {
                    if (href) {
                        window.open(href, '_blank');
                    }
                }}
            />
            <Image
                src={darkSrc}
                alt={alt}
                width={width}
                height={height}
                className={cn(`hidden dark:block ${href ? 'cursor-pointer' : ''}`, className)}
                {...rest}
                onClick={() => {
                    if (href) {
                        window.open(href, '_blank');
                    }
                }}
            />
        </>
    );
};
