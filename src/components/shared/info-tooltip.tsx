'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoTooltipProps } from '@/types/InfoTooltipProps';
import { cn } from '@/utils/helpers';

export const InfoTooltip = ({ label, side, align, children, className }: InfoTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className={cn('text-sm font-semibold', className)}>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
