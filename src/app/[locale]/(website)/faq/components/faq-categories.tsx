'use client';

import { cn } from '@/lib';

interface FAQCategoriesProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    faqCounts: Record<string, number>;
}

export function FAQCategories({
    categories,
    selectedCategory,
    onCategoryChange,
    faqCounts,
}: FAQCategoriesProps) {
    return (
        <div className="mb-6">
            <h3 className="text-foreground mb-3 font-semibold">Kategoriler</h3>
            <div className="space-y-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryChange(category)}
                        className={cn(
                            'flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-all duration-300',
                            selectedCategory === category
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                    >
                        <span>{category === 'all' ? 'Tümü' : category}</span>
                        <span className="text-xs opacity-60">{faqCounts[category] || 0}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
