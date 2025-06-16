'use client';

import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';

const DynamicMDXRemote = dynamic(() => Promise.resolve(MDXRemote), {
    ssr: false,
});

interface MDXPreviewProps {
    content: string;
}

export function MDXPreview({ content }: MDXPreviewProps) {
    const [mdxSource, setMdxSource] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const prepareMdx = async () => {
            try {
                const mdx = await serialize(content);
                setMdxSource(mdx);
            } catch (error) {
                console.error('MDX hazırlanırken hata:', error);
            } finally {
                setIsLoading(false);
            }
        };

        prepareMdx();
    }, [content]);

    if (isLoading) {
        return <div>Yükleniyor...</div>;
    }

    return mdxSource ? <DynamicMDXRemote {...mdxSource} /> : null;
}
