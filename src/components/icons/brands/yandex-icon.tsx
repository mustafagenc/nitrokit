import { SVGProps } from 'react';

export function YandexIcon(props: SVGProps<SVGSVGElement> & { color?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
            <g transform="matrix(.75 0 0 .75 32 32)">
                <g
                    fill={props.color || '#ff0000'}
                    fillOpacity="0"
                    strokeMiterlimit="10"
                    fontFamily="none"
                    fontSize="none"
                    fontWeight="none"
                    style={{ mixBlendMode: 'normal' }}
                    textAnchor="none"
                >
                    <path fill="none" d="M-42.7 298.7V-42.7h341.4v341.4z" />
                </g>
                <g
                    fill={props.color || '#ff0000'}
                    strokeMiterlimit="10"
                    fontFamily="none"
                    fontSize="none"
                    fontWeight="none"
                    style={{ mixBlendMode: 'normal' }}
                    textAnchor="none"
                >
                    <path d="M128 292.6a164.6 164.6 0 0 1 0-329.1 164.6 164.6 0 1 1 0 329.1z" />
                </g>
                <g
                    fill="#ffffff"
                    strokeMiterlimit="10"
                    fontFamily="none"
                    fontSize="none"
                    fontWeight="none"
                    style={{ mixBlendMode: 'normal' }}
                    textAnchor="none"
                >
                    <g transform="scale(5.33333)">
                        <path d="M21.4 47.3h4.9c-.4-4 .7-8.4.3-12.5a17.9 17.9 0 0 1 1.7-8.6c3.5-8.8 5.8-15.8 9-24.7H32c-3 7.5-6 15.2-8 22.9-3.7-6.1-5.2-12.2-7.1-18.4-.1-.4-.3-.9-.7-1.1-.2-.2-.5-.2-.8-.2-1.6-.1-3.1-.2-4.7-.1A185.7 185.7 0 0 1 21 33.4c.2 1.4.4 2.7.4 4.2v9.7z" />
                        <path d="M37.2 1H32c-.3 0-.4.2-.5.4a252 252 0 0 0-7.7 21.7 61.7 61.7 0 0 1-4.9-12l-1-3.3c-.2-1-.4-2-.9-2.8-.5-.8-1.5-.8-2.3-.9a43 43 0 0 0-4 0c-.4 0-.6.4-.4.7 2.5 5.5 4.7 11 6.7 16.7 1.8 5.4 4 11 4 16.9v9l.1.3.3.1h4.9c.3 0 .5-.2.5-.5-.3-3.3.3-6.7.4-10 0-1.5-.2-3 0-4.5 0-1.3.1-2.5.5-3.7l3.2-8 3.2-9 3.6-10.4c.1-.3-.2-.7-.5-.7zm-7 18.7L27 28c-.4 1.1-.7 2.3-.8 3.5l-.1 2V36c.2 3.7-.5 7.3-.3 11h-3.9c0-5.4.5-10.9-1-16.1A162 162 0 0 0 11.6 5h3c.4 0 1.1 0 1.5.2.3.3.4.9.6 1.3l1.8 6c1.3 4.2 2.9 8.3 5.1 12 .2.4.8.3 1 0A241 241 0 0 1 32.2 2h4.2c-2 6-4 11.8-6.2 17.7z" />
                    </g>
                </g>
            </g>
        </svg>
    );
}
