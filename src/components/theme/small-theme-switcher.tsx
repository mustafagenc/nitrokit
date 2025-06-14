'use client';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useId } from 'react';

import SmallLoading from '@/components/shared/small-loading';
import { Switch } from '@/components/ui/switch';
import useNextTheme from '@/hooks/useNextTheme';
import { Label } from '@radix-ui/react-label';

export const SmallThemeSwitcher = () => {
    const [isDark, mounted, setTheme] = useNextTheme();
    const id = useId();

    if (!mounted) {
        return <SmallLoading />;
    }

    return (
        <div className="flex items-center space-x-2">
            <Label htmlFor={`theme-switch-${id}`} className="sr-only">
                Toggle theme
            </Label>
            <SunIcon className="h-4 w-4" />
            <Switch
                id={`theme-switch-${id}`}
                checked={isDark === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
            <MoonIcon className="h-4 w-4" />
        </div>
    );
};
