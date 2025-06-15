'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

const MDEditor = dynamic(() => import('@uiw/react-md-editor').then((mod) => mod.default), {
    ssr: false,
});

interface MDXEditorComponentProps {
    value: string;
    onChange: (value: string) => void;
}

export function MDXEditorComponent({ value, onChange }: MDXEditorComponentProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-[200px]" />;
    }

    return (
        <div data-color-mode={theme || 'light'} className="min-h-[200px]">
            <MDEditor
                value={value}
                onChange={(val) => onChange(val || '')}
                preview="edit"
                hideToolbar={false}
                height={200}
            />
        </div>
    );
}
