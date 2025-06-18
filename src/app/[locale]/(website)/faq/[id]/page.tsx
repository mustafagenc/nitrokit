import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    Calendar,
    Tag,
    Users,
    Share2,
    Bookmark,
    ThumbsUp,
    MessageSquare,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import { MDXContentClient } from './components/mdx-content';
import { faqDetailData } from '@/constants/demo';
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

interface FAQDetailPageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function FAQDetailPage({ params }: FAQDetailPageProps) {
    const { id } = await params;
    const faq = faqDetailData.find((f) => f.id === id);

    if (!faq) {
        notFound();
    }

    return (
        <main className="min-h-screen py-16">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="mx-auto max-w-4xl">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/faq">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Geri Dön
                            </Link>
                        </Button>
                    </div>

                    {/* Header Section */}
                    <div className="mb-8">
                        {/* Categories and Tags */}
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className="text-sm">
                                {faq.category}
                            </Badge>
                            {faq.isPopular && (
                                <Badge variant="default" className="bg-yellow-500 text-white">
                                    ⭐ Popüler
                                </Badge>
                            )}
                            {faq.tags?.map(
                                (
                                    tag:
                                        | boolean
                                        | Key
                                        | ReactElement<unknown, string | JSXElementConstructor<any>>
                                        | Iterable<ReactNode>
                                        | Promise<
                                              | string
                                              | number
                                              | bigint
                                              | boolean
                                              | ReactPortal
                                              | ReactElement<
                                                    unknown,
                                                    string | JSXElementConstructor<any>
                                                >
                                              | Iterable<ReactNode>
                                              | null
                                              | undefined
                                          >
                                        | null
                                        | undefined,
                                    idx: number
                                ) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                        <Tag className="mr-1 h-3 w-3" />
                                        {tag}
                                    </Badge>
                                )
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-foreground mb-6 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
                            {faq.question}
                        </h1>

                        {/* Meta Information */}
                        <div className="text-muted-foreground flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Son güncelleme: {faq.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{faq.readTime} dk okuma</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                <span>{faq.viewCount || 0} görüntülenme</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mb-8 flex flex-wrap items-center gap-3">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4" />
                            Faydalı ({faq.likes || 0})
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Bookmark className="h-4 w-4" />
                            Kaydet
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Share2 className="h-4 w-4" />
                            Paylaş
                        </Button>
                    </div>

                    <Separator className="mb-8" />

                    {/* MDX Content */}
                    <article className="mb-12">
                        <MDXContentClient content={faq.detailedAnswer} />
                    </article>

                    {/* Content Actions */}
                    <div className="bg-muted/30 mb-8 rounded-lg p-6">
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-foreground mb-2 text-lg font-semibold">
                                Bu cevap yardımcı oldu mu?
                            </h3>
                            <p className="text-muted-foreground mb-4 text-sm">
                                Geri bildiriminiz bize daha iyi içerik hazırlamamız için yardımcı
                                olur.
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <ThumbsUp className="h-4 w-4" />
                                    Evet, faydalı
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Geliştirilmeli
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Separator className="mb-8" />

                    {/* Related FAQs */}
                    {faq.relatedFAQs && faq.relatedFAQs.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-foreground mb-6 text-2xl font-bold">
                                İlgili Sorular
                            </h2>
                            <div className="grid gap-6 md:grid-cols-2">
                                {faq.relatedFAQs.map(
                                    (related: {
                                        id: Key | null | undefined;
                                        category:
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | ReactElement<
                                                  unknown,
                                                  string | JSXElementConstructor<any>
                                              >
                                            | Iterable<ReactNode>
                                            | ReactPortal
                                            | Promise<
                                                  | string
                                                  | number
                                                  | bigint
                                                  | boolean
                                                  | ReactPortal
                                                  | ReactElement<
                                                        unknown,
                                                        string | JSXElementConstructor<any>
                                                    >
                                                  | Iterable<ReactNode>
                                                  | null
                                                  | undefined
                                              >
                                            | null
                                            | undefined;
                                        question:
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | ReactElement<
                                                  unknown,
                                                  string | JSXElementConstructor<any>
                                              >
                                            | Iterable<ReactNode>
                                            | ReactPortal
                                            | Promise<
                                                  | string
                                                  | number
                                                  | bigint
                                                  | boolean
                                                  | ReactPortal
                                                  | ReactElement<
                                                        unknown,
                                                        string | JSXElementConstructor<any>
                                                    >
                                                  | Iterable<ReactNode>
                                                  | null
                                                  | undefined
                                              >
                                            | null
                                            | undefined;
                                        shortAnswer:
                                            | string
                                            | number
                                            | bigint
                                            | boolean
                                            | ReactElement<
                                                  unknown,
                                                  string | JSXElementConstructor<any>
                                              >
                                            | Iterable<ReactNode>
                                            | ReactPortal
                                            | Promise<
                                                  | string
                                                  | number
                                                  | bigint
                                                  | boolean
                                                  | ReactPortal
                                                  | ReactElement<
                                                        unknown,
                                                        string | JSXElementConstructor<any>
                                                    >
                                                  | Iterable<ReactNode>
                                                  | null
                                                  | undefined
                                              >
                                            | null
                                            | undefined;
                                        readTime: any;
                                        viewCount: any;
                                    }) => (
                                        <Link
                                            key={related.id}
                                            href={`/faq/${related.id}`}
                                            className="group border-border/50 bg-background/50 hover:border-border hover:bg-background rounded-lg border p-6 transition-all duration-300 hover:shadow-md"
                                        >
                                            <div className="mb-3">
                                                <Badge variant="outline" className="text-xs">
                                                    {related.category}
                                                </Badge>
                                            </div>
                                            <h3 className="text-foreground group-hover:text-primary mb-3 font-semibold transition-colors">
                                                {related.question}
                                            </h3>
                                            <p className="text-muted-foreground line-clamp-3 text-sm">
                                                {related.shortAnswer}
                                            </p>
                                            <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
                                                <span>{related.readTime || 2} dk okuma</span>
                                                <span>•</span>
                                                <span>{related.viewCount || 0} görüntülenme</span>
                                            </div>
                                        </Link>
                                    )
                                )}
                            </div>
                        </section>
                    )}

                    {/* More from Category */}
                    <section className="mb-12">
                        <h2 className="text-foreground mb-6 text-2xl font-bold">
                            {faq.category} Kategorisinden Daha Fazlası
                        </h2>
                        <div className="border-border/50 from-primary/5 to-secondary/5 rounded-lg border bg-gradient-to-br p-6 text-center">
                            <p className="text-muted-foreground mb-4">
                                {faq.category} kategorisindeki diğer soruları keşfedin.
                            </p>
                            <Button asChild>
                                <Link href={`/faq?category=${encodeURIComponent(faq.category)}`}>
                                    Tüm {faq.category} Sorularını Görüntüle
                                </Link>
                            </Button>
                        </div>
                    </section>

                    <Separator className="mb-8" />

                    {/* Comments Section - Placeholder */}
                    <section className="mb-12">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-foreground flex items-center gap-2 text-2xl font-bold">
                                <MessageSquare className="h-6 w-6" />
                                Yorumlar
                                <Badge variant="secondary" className="ml-2">
                                    {faq.commentCount || 0}
                                </Badge>
                            </h2>
                        </div>

                        <div className="border-border/50 bg-muted/20 rounded-lg border border-dashed p-8 text-center">
                            <MessageSquare className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
                            <h3 className="text-foreground mb-2 text-lg font-semibold">
                                Yorum sistemi yakında geliyor!
                            </h3>
                            <p className="text-muted-foreground">
                                Bu soruyla ilgili düşüncelerinizi ve deneyimlerinizi
                                paylaşabileceksiniz.
                            </p>
                        </div>
                    </section>

                    {/* Contact Support */}
                    <section>
                        <div className="border-border/50 rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-950/20 dark:to-indigo-950/20">
                            <div className="text-center">
                                <h3 className="text-foreground mb-2 text-lg font-semibold">
                                    Hala yardıma mı ihtiyacınız var?
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Bu soruyla ilgili daha fazla desteğe ihtiyacınız varsa bizimle
                                    iletişime geçin.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <Button variant="default" asChild>
                                        <a href="mailto:support@nitrokit.dev">E-posta Gönder</a>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/contact">İletişim Formu</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
