'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PopularFAQs } from './components/popular-faqs';
import { FAQCategories } from './components/faq-categories';
import { FAQList } from './components/faq-list';
import { FAQContact } from './components/faq-contact';
import { faqData } from '@/constants/demo';
import PageHero from '@/components/shared/page-hero';

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', ...Array.from(new Set(faqData.map((faq) => faq.category)))];
    const faqCounts = categories.reduce(
        (acc, category) => {
            acc[category] =
                category === 'all'
                    ? faqData.length
                    : faqData.filter((f) => f.category === category).length;
            return acc;
        },
        {} as Record<string, number>
    );

    const filteredFAQs = faqData.filter((faq) => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.shortAnswer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
    };

    return (
        <div className="w-full px-4 lg:mx-auto lg:w-7xl lg:p-0">
            <PageHero
                h1="Sıkça Sorulan Sorular"
                h2="FAQ"
                p="NitroKit hakkında merak ettiğiniz her şey burada. Aradığınızı bulamıyor musunuz? Bizimle iletişime geçin!"
            />
            <PopularFAQs
                faqs={faqData.map((faq) => ({ ...faq, isPopular: faq.isPopular ?? false }))}
            />
            <div className="flex flex-col gap-8 lg:flex-row">
                <div className="lg:w-1/4">
                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                                placeholder="Soru ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <FAQCategories
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        faqCounts={faqCounts}
                    />

                    {(searchTerm || selectedCategory !== 'all') && (
                        <div className="mb-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="w-full"
                            >
                                Filtreleri Temizle
                            </Button>
                        </div>
                    )}

                    <FAQContact />
                </div>

                <div className="lg:w-3/4">
                    <FAQList faqs={filteredFAQs} />
                </div>
            </div>
        </div>
    );
}
