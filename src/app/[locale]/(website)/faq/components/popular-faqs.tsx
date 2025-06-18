'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface PopularFAQ {
    id: string;
    question: string;
    shortAnswer: string;
    isPopular: boolean;
}

interface PopularFAQsProps {
    faqs: PopularFAQ[];
    title?: string;
}

export function PopularFAQs({ faqs, title = 'En Popüler Sorular' }: PopularFAQsProps) {
    const popularFAQs = faqs.filter((faq) => faq.isPopular).slice(0, 3);

    if (popularFAQs.length === 0) return null;

    return (
        <div className="mb-12">
            <h3 className="text-foreground mb-6 flex items-center gap-2 text-xl font-semibold">
                <span className="text-yellow-500">⭐</span>
                {title}
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
                {popularFAQs.map((faq) => (
                    <div
                        key={faq.id}
                        className="group border-border/50 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 rounded-lg border p-6 transition-all duration-300 hover:shadow-md"
                    >
                        <div className="mb-3 flex items-start justify-between">
                            <Badge variant="secondary" className="text-xs">
                                Popüler
                            </Badge>
                        </div>

                        <h4 className="text-foreground group-hover:text-primary mb-3 line-clamp-2 font-semibold transition-colors">
                            {faq.question}
                        </h4>

                        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                            {faq.shortAnswer}
                        </p>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 font-medium transition-transform group-hover:translate-x-1"
                            asChild
                        >
                            <Link href={`/faq/${faq.id}`}>
                                Devamını oku
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
