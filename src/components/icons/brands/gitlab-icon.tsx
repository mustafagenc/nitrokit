import { SVGProps } from 'react';

export function GitlabIcon(props: SVGProps<SVGSVGElement> & { color?: string }) {
    const { color, ...rest } = props;
    const primaryColor = color || '#e24329';
    const secondaryColor = color || '#fc6d26';
    const tertiaryColor = color || '#fca326';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="94 97.5 192.1 185"
            {...rest}
        >
            <path
                fill={primaryColor}
                d="m282.8 170.7-.2-.7-26.2-68.2a6.8 6.8 0 0 0-2.7-3.2 7 7 0 0 0-8 .4 7 7 0 0 0-2.3 3.5l-17.6 54h-71.5l-17.7-54a6.9 6.9 0 0 0-2.3-3.5 7 7 0 0 0-8-.4 6.9 6.9 0 0 0-2.7 3.2L97.4 170l-.2.7a48.5 48.5 0 0 0 16 56l.2.2.2.1 39.8 29.8 19.7 15 12 9a8 8 0 0 0 9.8 0l12-9 19.7-15 40-30h.1a48.6 48.6 0 0 0 16.1-56Z"
            />
            <path
                fill={secondaryColor}
                d="m282.8 170.7-.2-.7a88.3 88.3 0 0 0-35.2 15.8L190 229.2a53007 53007 0 0 0 36.6 27.7l40-30h.1a48.6 48.6 0 0 0 16.1-56.2Z"
            />
            <path
                fill={tertiaryColor}
                d="m153.4 256.9 19.7 14.9 12 9a8 8 0 0 0 9.8 0l12-9 19.7-15-36.6-27.6-36.6 27.7Z"
            />
            <path
                fill={secondaryColor}
                d="M132.6 185.8A88.2 88.2 0 0 0 97.4 170l-.2.7a48.5 48.5 0 0 0 16 56l.2.2.2.1 39.8 29.8 36.6-27.6Z"
            />
        </svg>
    );
}
