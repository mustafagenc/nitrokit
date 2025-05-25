'use client';
import { MoonIcon, SunIcon, MonitorIcon } from 'lucide-react';
import { Suspense } from 'react';

import SmallLoading from '@/components/shared/small-loading';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useNextTheme from '@/hooks/useNextTheme';

export const CompactThemeSwitcher = () => {
    const [theme, mounted, setTheme] = useNextTheme();

    if (!mounted) {
        return <SmallLoading />;
    }

    const themes = [
        { value: 'light', icon: SunIcon, label: 'Light' },
        { value: 'dark', icon: MoonIcon, label: 'Dark' },
        { value: 'system', icon: MonitorIcon, label: 'System' },
    ];

    const cycleTheme = () => {
        const currentIndex = themes.findIndex(t => t.value === theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex].value);
    };

    const getCurrentIcon = () => {
        const currentTheme = themes.find(t => t.value === theme);
        if (!currentTheme) return <MonitorIcon size={14} />;
        const Icon = currentTheme.icon;
        return <Icon size={14} />;
    };

    const getCurrentLabel = () => {
        const currentTheme = themes.find(t => t.value === theme);
        return currentTheme?.label || 'System';
    };

    return (
        <Suspense fallback={<SmallLoading />}>
            <TooltipProvider>
                {/* Desktop: Toggle Group */}
                <div className="hidden sm:block">
                    <ToggleGroup
                        type="single"
                        value={theme || 'system'}
                        onValueChange={value => {
                            if (value) setTheme(value);
                        }}
                        className="border-border/30 bg-background/60 rounded-lg border p-1 backdrop-blur-sm"
                        size="sm">
                        {themes.map(({ value, icon: Icon, label }) => (
                            <Tooltip key={value}>
                                <TooltipTrigger asChild>
                                    <ToggleGroupItem
                                        value={value}
                                        aria-label={`Switch to ${label} theme`}
                                        className={`data-[state=on]:ring-primary/20 h-6 w-6 cursor-pointer p-0 transition-all duration-300 hover:scale-105 data-[state=on]:scale-105 data-[state=on]:ring-2 ${
                                            theme === value
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-accent/30 opacity-60 hover:opacity-100'
                                        } `}>
                                        <Icon
                                            size={12}
                                            className={
                                                theme === value ? 'text-primary' : 'opacity-70'
                                            }
                                        />
                                    </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs font-medium">
                                        {theme === value && (
                                            <span className="text-primary mr-1">●</span>
                                        )}
                                        {label}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </ToggleGroup>
                </div>
                <div className="sm:hidden">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={cycleTheme}
                                className="hover:bg-accent/30 relative h-7 w-7 rounded-lg p-0 transition-all duration-200 hover:scale-105"
                                aria-label="Cycle theme">
                                <div className="relative">
                                    {/* Soft background for active state */}
                                    <div className="bg-primary/8 absolute inset-0 rounded-sm" />

                                    {/* Icon container with soft background */}
                                    <div className="from-primary/8 to-primary/4 border-primary/10 relative z-10 flex h-full w-full items-center justify-center rounded-sm border bg-gradient-to-br">
                                        {getCurrentIcon()}
                                    </div>

                                    {/* Subtle active indicator */}
                                    <div className="bg-primary/60 absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" />
                                </div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs font-medium">
                                <span className="bg-primary/60 mr-2 inline-block h-1.5 w-1.5 rounded-full"></span>
                                {getCurrentLabel()}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        </Suspense>
    );
};
