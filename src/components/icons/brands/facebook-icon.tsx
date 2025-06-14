import { SVGProps } from 'react';

export function FacebookIcon(props: SVGProps<SVGSVGElement> & { color?: string }) {
    const { color, ...rest } = props;
    const primaryColor = color || '#1877F2';
    const secondaryColor = color ? 'currentColor' : '#FFFFFF';

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 256"
            {...rest}
        >
            <path
                fill={primaryColor}
                d="M256 128a128 128 0 1 0-148 126.4V165H75.5v-37H108V99.8c0-32 19.1-49.8 48.3-49.8 14 0 28.7 2.5 28.7 2.5V84h-16.1c-16 0-20.9 9.9-20.9 20v24h35.5l-5.7 37H148v89.4A128 128 0 0 0 256 128"
            />
            <path
                fill={secondaryColor}
                d="m177.8 165 5.7-37H148v-24c0-10.1 5-20 20.9-20H185V52.5S170.4 50 156.3 50C127.1 50 108 67.7 108 99.8V128H75.5v37H108v89.4a129 129 0 0 0 40 0V165h29.8"
            />
        </svg>
    );
}
