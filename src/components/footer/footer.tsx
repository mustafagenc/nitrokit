'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Heart, Palette, Mail, Send } from 'lucide-react';
import { CompactThemeSwitcher } from '@/components/theme/compact-theme-switcher';
import PoweredBy from '@/components/shared/powered-by';
import { SOCIAL_LINKS } from '@/constants/site';
import Logo from '@/components/shared/logo';
import { Version } from '@/components/shared/version';

const footerLinks = {
    product: [
        { name: 'Özellikler', href: '/features' },
        { name: 'Fiyatlandırma', href: '/pricing' },
        { name: 'Dokümantasyon', href: '/docs' },
        { name: 'Örnekler', href: '/storybook' },
    ],
    support: [
        { name: 'Başlangıç Rehberi', href: '/docs/getting-started' },
        { name: 'SSS', href: '/faq' },
        { name: 'Topluluk', href: 'https://github.com/mustafagenc/nitrokit/discussions' },
        { name: 'İletişim', href: '/contact' },
    ],
};

export function Footer() {
    const [email, setEmail] = React.useState('');
    const [isSubscribed, setIsSubscribed] = React.useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    return (
        <footer className="my-10 flex w-full flex-col items-center justify-center lg:mx-auto lg:w-7xl">
            <div className="relative">
                <section className="py-6">
                    <div className="grid gap-6 lg:grid-cols-7">
                        <div className="lg:col-span-3 lg:pr-20">
                            <Logo />
                            <p className="text-muted-foreground my-4 leading-relaxed">
                                Modern web uygulamaları geliştirmek için tasarlanmış kapsamlı
                                Next.js starter kit&apos;i.
                            </p>

                            <div className="flex gap-2">
                                {SOCIAL_LINKS.map((social, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="icon"
                                        asChild
                                        className="hover:bg-primary hover:text-primary-foreground h-8 w-8 transition-colors"
                                    >
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.name}
                                        >
                                            <social.icon className="h-3 w-3" />
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10">
                                    <Palette className="h-3 w-3 text-blue-500" />
                                </div>
                                Ürün
                            </h3>
                            <nav className="space-y-3">
                                {footerLinks.product.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground group flex items-center text-sm transition-colors"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div>
                            <h3 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-green-500/10">
                                    <Heart className="h-3 w-3 text-green-500" />
                                </div>
                                Destek
                            </h3>
                            <nav className="space-y-3">
                                {footerLinks.support.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="text-muted-foreground hover:text-foreground group flex items-center text-sm transition-colors"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="ml-1 h-3 w-3 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="lg:col-span-2">
                            <h3 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/10">
                                    <Mail className="h-3 w-3 text-purple-500" />
                                </div>
                                Haber Bülteni
                            </h3>

                            <div className="mb-4">
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Yeni özellikler ve geliştirmeler hakkında bilgi alın.
                                </p>
                            </div>

                            <form onSubmit={handleSubscribe} className="space-y-3">
                                <Input
                                    type="email"
                                    placeholder="E-posta adresiniz"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-9 w-full"
                                    required
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubscribed}
                                    size="sm"
                                    className="h-9 w-full"
                                >
                                    {isSubscribed ? (
                                        <>
                                            <Heart className="mr-2 h-3 w-3 fill-current" />
                                            Teşekkürler!
                                        </>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-3 w-3" />
                                            Abone Ol
                                        </>
                                    )}
                                </Button>
                            </form>

                            <p className="text-muted-foreground mt-2 text-xs">
                                İstediğiniz zaman abonelikten çıkabilirsiniz.
                            </p>
                        </div>
                    </div>
                </section>

                <Separator />

                <section className="flex flex-col items-center justify-between gap-4 py-3 md:flex-row">
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <span>© 2024 Nitrokit. Tüm hakları saklıdır.</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> in
                            Turkey
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <CompactThemeSwitcher />
                        <div className="bg-border h-4 w-px" />
                        <PoweredBy />
                        <div className="bg-border h-4 w-px" />
                        <Version />
                    </div>
                </section>
            </div>
        </footer>
    );
}
