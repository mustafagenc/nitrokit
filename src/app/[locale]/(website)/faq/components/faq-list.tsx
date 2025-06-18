'use client';

import { useState } from 'react';
import { ChevronDown, ExternalLink, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import { Link } from '@/i18n/navigation';

interface FAQItem {
    id: string;
    question: string;
    shortAnswer: string;
    category: string;
    tags?: string[];
    isPopular?: boolean;
    hasDetailPage?: boolean;
}

interface FAQListProps {
    faqs: FAQItem[];
}

export function FAQList({ faqs }: FAQListProps) {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
        setOpenItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    if (faqs.length === 0) {
        return (
            <div className="py-12 text-center">
                <div className="mb-4 text-6xl">🤔</div>
                <h3 className="text-foreground mb-2 text-lg font-semibold">Sonuç bulunamadı</h3>
                <p className="text-muted-foreground">
                    Aradığınız kriterlere uygun soru bulunamadı. Farklı anahtar kelimeler deneyin.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {faqs.map((faq) => {
                const isOpen = openItems.includes(faq.id);

                return (
                    <div
                        key={faq.id}
                        className="group border-border/50 bg-background/50 hover:border-border rounded-lg border backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                    >
                        <button
                            onClick={() => toggleItem(faq.id)}
                            className="flex w-full items-center justify-between p-6 text-left transition-all duration-300"
                        >
                            <div className="flex-1 pr-4">
                                <div className="mb-2 flex items-center gap-2">
                                    <h3 className="text-foreground group-hover:text-primary text-lg font-semibold transition-colors">
                                        {faq.question}
                                    </h3>
                                    {faq.isPopular && (
                                        <Badge variant="secondary" className="text-xs">
                                            Popüler
                                        </Badge>
                                    )}
                                    {faq.hasDetailPage && (
                                        <Badge variant="outline" className="text-xs">
                                            Detaylı
                                        </Badge>
                                    )}
                                </div>
                                {faq.tags && (
                                    <div className="flex flex-wrap gap-1">
                                        {faq.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5 text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <ChevronDown
                                className={cn(
                                    'text-muted-foreground h-5 w-5 transition-transform duration-300',
                                    isOpen && 'rotate-180',
                                    'group-hover:text-primary'
                                )}
                            />
                        </button>

                        <div
                            className={cn(
                                'overflow-hidden transition-all duration-300 ease-in-out',
                                isOpen ? 'max-h-96 pb-6' : 'max-h-0'
                            )}
                        >
                            <div className="px-6">
                                <div className="border-border/30 border-t pt-4">
                                    <p className="text-muted-foreground mb-4 leading-relaxed">
                                        {faq.shortAnswer}
                                    </p>

                                    {faq.hasDetailPage && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="group/btn"
                                            asChild
                                        >
                                            <Link href={`/faq/${faq.id}`}>
                                                <ExternalLink className="mr-2 h-3 w-3" />
                                                Detayları Görüntüle
                                                <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
