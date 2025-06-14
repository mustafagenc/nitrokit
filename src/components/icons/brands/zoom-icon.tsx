import { SVGProps } from 'react';

export function ZoomIcon(props: SVGProps<SVGSVGElement> & { color?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
            <defs>
                <linearGradient
                    id="zoom-gradient"
                    x1="23.666%"
                    x2="76.334%"
                    y1="95.6118%"
                    y2="4.3882%"
                >
                    <stop offset="5.791949e-05%" stopColor="#0845BF" />
                    <stop offset="19.11%" stopColor="#0950DE" />
                    <stop offset="38.23%" stopColor="#0B59F6" />
                    <stop offset="50%" stopColor="#0B5CFF" />
                    <stop offset="67.32%" stopColor="#0E5EFE" />
                    <stop offset="77.74%" stopColor="#1665FC" />
                    <stop offset="86.33%" stopColor="#246FF9" />
                    <stop offset="93.88%" stopColor="#387FF4" />
                    <stop offset="100%" stopColor="#4F90EE" />
                </linearGradient>
            </defs>
            <g>
                <path
                    fill="url(#zoom-gradient)"
                    d="M256 128c0 13.6-1 27.1-3.3 40.2-7 43.3-41.2 77.6-84.5 84.5A232 232 0 0 1 128 256c-13.6 0-27.1-1-40.2-3.3-43.3-7-77.6-41.2-84.5-84.5A232 232 0 0 1 0 128c0-13.6 1-27.1 3.3-40.2 7-43.3 41.2-77.6 84.5-84.5A232 232 0 0 1 128 0c13.6 0 27.1 1 40.2 3.3 43.3 7 77.6 41.2 84.5 84.5A232 232 0 0 1 256 128Z"
                />
                <path
                    fill="#FFFFFF"
                    d="M204 207.9H75c-8.4 0-16.6-4.6-20.5-12a22.2 22.2 0 0 1 4.1-26.2L148.5 80H84a32 32 0 0 1-32-32h118.8a23 23 0 0 1 20.4 12 22.2 22.2 0 0 1-4 26.1l-89.7 90.1H172c17.7 0 32 14.1 32 31.8Z"
                />
            </g>
        </svg>
    );
}
