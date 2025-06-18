'use client';

import { useState, useEffect } from 'react';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle,
    Info,
    AlertTriangle,
    Lightbulb,
    Palette,
    Database,
    Globe,
    Settings,
} from 'lucide-react';

// Same components as server version...
const FrontendIcon = () => <Palette className="h-5 w-5" />;
const BackendIcon = () => <Database className="h-5 w-5" />;
const DevToolsIcon = () => <Settings className="h-5 w-5" />;
const UIIcon = () => <Palette className="h-5 w-5" />;
const DeploymentIcon = () => <Globe className="h-5 w-5" />;

const components = {
    // Same components as above...
    h1: ({ children }: any) => (
        <h1 className="text-foreground mt-8 mb-4 text-2xl font-bold first:mt-0">{children}</h1>
    ),
    h2: ({ children }: any) => (
        <h2 className="text-foreground mt-6 mb-3 flex items-center gap-2 text-xl font-semibold first:mt-0">
            {children}
        </h2>
    ),
    h3: ({ children }: any) => (
        <h3 className="text-foreground mt-4 mb-2 text-lg font-medium">{children}</h3>
    ),
    p: ({ children }: any) => (
        <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => <ul className="text-muted-foreground mb-4 space-y-2">{children}</ul>,
    li: ({ children }: any) => (
        <li className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <span>{children}</span>
        </li>
    ),
    TechStack: ({ title, icon, children }: any) => {
        const iconMap: Record<string, React.ComponentType> = {
            FrontendIcon,
            BackendIcon,
            DevToolsIcon,
            UIIcon,
            DeploymentIcon,
        };
        const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon || FrontendIcon;

        return (
            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <IconComponent />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">{children}</ul>
                </CardContent>
            </Card>
        );
    },
    TechItem: ({ name, description }: any) => (
        <li className="hover:bg-muted/50 flex items-start gap-3 rounded-md p-3 transition-colors">
            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
            <div>
                <span className="text-foreground font-medium">{name}:</span>
                <span className="text-muted-foreground ml-1">{description}</span>
            </div>
        </li>
    ),
    InfoBox: ({ type = 'info', title, children }: any) => {
        const styles = {
            info: {
                border: 'border-blue-200 dark:border-blue-800',
                bg: 'bg-blue-50 dark:bg-blue-950/30',
                icon: Info,
                iconColor: 'text-blue-600 dark:text-blue-400',
                textColor: 'text-blue-800 dark:text-blue-200',
            },
            tip: {
                border: 'border-green-200 dark:border-green-800',
                bg: 'bg-green-50 dark:bg-green-950/30',
                icon: Lightbulb,
                iconColor: 'text-green-600 dark:text-green-400',
                textColor: 'text-green-800 dark:text-green-200',
            },
            warning: {
                border: 'border-yellow-200 dark:border-yellow-800',
                bg: 'bg-yellow-50 dark:bg-yellow-950/30',
                icon: AlertTriangle,
                iconColor: 'text-yellow-600 dark:text-yellow-400',
                textColor: 'text-yellow-800 dark:text-yellow-200',
            },
        };
        const style = styles[type as keyof typeof styles] || styles.info;
        const Icon = style.icon;
        return (
            <div className={`mb-6 rounded-lg border p-4 ${style.border} ${style.bg}`}>
                <div className="flex items-start gap-3">
                    <Icon className={`mt-0.5 h-5 w-5 ${style.iconColor}`} />
                    <div className="flex-1">
                        {title && (
                            <h4 className={`mb-2 font-semibold ${style.textColor}`}>{title}</h4>
                        )}
                        <div className={style.textColor}>{children}</div>
                    </div>
                </div>
            </div>
        );
    },
    FrontendIcon,
    BackendIcon,
    DevToolsIcon,
    UIIcon,
    DeploymentIcon,
};

interface MDXContentClientProps {
    content: string;
}

export function MDXContentClient({ content }: MDXContentClientProps) {
    const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function compileMDX() {
            try {
                const { default: MDXComponent } = await evaluate(content, {
                    ...runtime,
                    useMDXComponents: () => components,
                });
                setMDXContent(() => MDXComponent);
            } catch (error) {
                console.error('MDX compilation error:', error);
            } finally {
                setIsLoading(false);
            }
        }

        compileMDX();
    }, [content]);

    if (isLoading) {
        return (
            <div className="mdx-content animate-pulse">
                <div className="bg-muted mb-4 h-6 rounded"></div>
                <div className="bg-muted mb-2 h-4 rounded"></div>
                <div className="bg-muted mb-2 h-4 rounded"></div>
                <div className="bg-muted mb-4 h-4 w-3/4 rounded"></div>
            </div>
        );
    }

    if (!MDXContent) {
        return (
            <div className="mdx-content rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
                <p className="text-red-800 dark:text-red-200">
                    İçerik yüklenirken bir hata oluştu.
                </p>
            </div>
        );
    }

    return (
        <div className="mdx-content">
            <MDXContent />
        </div>
    );
}
