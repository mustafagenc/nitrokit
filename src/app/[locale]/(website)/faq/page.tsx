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
        <main className="w-full">
            <div className="w-full px-4 lg:mx-auto lg:w-7xl lg:p-0">
                <div className="mx-auto max-w-3xl text-center leading-22">
                    <h2 className="font-semibold text-cyan-500 dark:text-shadow-2xs">FAQ</h2>
                    <h1 className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-5xl leading-18 font-bold text-transparent dark:text-shadow-2xs">
                        Sıkça Sorulan Sorular
                    </h1>
                    <p className="mt-10 text-xl">
                        NitroKit hakkında merak ettiğiniz her şey burada. Aradığınızı bulamıyor
                        musunuz? Bizimle iletişime geçin!
                    </p>
                </div>
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
        </main>
    );
}
