'use client';

import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';

interface MDXEditorComponentProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function MDXEditorComponent({ value, onChange, placeholder }: MDXEditorComponentProps) {
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
