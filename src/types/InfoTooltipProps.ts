import { HTMLAttributes } from 'react';

export interface InfoTooltipProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    label: string;
    side?: 'left' | 'top' | 'right' | 'bottom';
    align?: 'start' | 'center' | 'end';
}
