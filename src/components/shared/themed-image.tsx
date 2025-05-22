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
    ...rest
}: ThemedImageProps) => {
    return (
        <>
            <Image
                src={lightSrc}
                alt={alt}
                width={width}
                height={height}
                className={cn('dark:hidden', className)}
                {...rest}
            />
            <Image
                src={darkSrc}
                alt={alt}
                width={width}
                height={height}
                className={cn('hidden dark:block', className)}
                {...rest}
            />
        </>
    );
};
