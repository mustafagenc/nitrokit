import { SVGProps } from 'react';

export function PinterestIcon(props: SVGProps<SVGSVGElement> & { color?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
            <path
                fill={props.color || '#bd081c'}
                d="M16.1 0a16 16 0 0 0-5.7 31 18 18 0 0 1 0-4.6l1.8-8a5.8 5.8 0 0 1-.5-2.4c0-2.2 1.3-4 2.9-4s2 1.1 2 2.3-1 3.4-1.4 5.4.8 2.8 2.4 2.8 5-3 5-7.3-2.8-6.6-6.7-6.6-7.1 3.6-7.1 7.1c0 1.3.5 3 1.2 3.7a.5.5 0 0 1 .1.4l-.4 1.8c-.1.3-.3.4-.5.3-2-1-3.3-3.8-3.3-6.2 0-5 3.7-9.7 10.6-9.7s9.9 4 9.9 9.2-3.6 10-8.3 10c-1.6 0-3.2-.8-3.7-1.9l-1 3.8c-.4 1.5-1.3 3.2-2 4.2A16 16 0 1 0 16.1 0z"
            />
        </svg>
    );
}
