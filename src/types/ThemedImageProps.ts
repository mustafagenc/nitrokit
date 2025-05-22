import { ImageProps } from 'next/image';

export interface ThemedImageProps extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> {
    lightSrc: string;
    darkSrc: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    href?: string;
}
