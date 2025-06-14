import { SVGProps } from 'react';

export function MicrosoftEntraIdIcon(props: SVGProps<SVGSVGElement> & { color?: string }) {
    const { color, ...rest } = props;
    const primaryColor = color || '#225086';
    const secondaryColor = color || '#6df';
    const tertiaryColor = color || '#cbf8ff';
    const quaternaryColor = color || '#074793';
    const quinaryColor = color || '#0294e4';
    const senaryColor = color || '#96bcc2';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 18 18" {...rest}>
            <path
                fill={primaryColor}
                d="M3.8 14.03a3.1 3.1 0 0 0 3.4.02L9 12.93V17c-.29 0-.57-.08-.82-.23L3.8 14.03Z"
            />
            <path
                fill={secondaryColor}
                d="M7.85 1.5.35 9.98c-.58.65-.43 1.64.33 2.1l3.12 1.96a3.1 3.1 0 0 0 3.4.02L9 12.94 4.64 10.2 9 5.28V1c-.42 0-.85.17-1.15.5Z"
            />
            <polygon
                fill={tertiaryColor}
                points="4.64 10.2 4.69 10.23 9 12.93 9 12.93 9 12.93 9 5.28 9 5.28 4.64 10.2"
            />
            <path
                fill={quaternaryColor}
                d="M17.32 12.08c.76-.47.9-1.46.33-2.11l-4.92-5.55a3.1 3.1 0 0 0-3.62.73l-.1.12 4.36 4.93L9 12.93V17c.29 0 .57-.08.82-.24l7.5-4.68Z"
            />
            <path
                fill={quinaryColor}
                d="M9 1v4.28l.11-.13a3.05 3.05 0 0 1 3.62-.73L10.15 1.5C9.85 1.17 9.42 1 9 1Z"
            />
            <polygon
                fill={senaryColor}
                points="13.37 10.2 13.37 10.2 13.37 10.2 9 5.28 9 12.93 13.37 10.2"
            />
        </svg>
    );
}
