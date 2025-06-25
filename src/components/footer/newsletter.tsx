'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Mail, Send } from 'lucide-react';

export function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                setIsSubscribed(true);
                setSuccess(true);
                setEmail('');
                setTimeout(() => setIsSubscribed(false), 3000);
            } else {
                setError(data.error || 'Bir hata oluştu.');
            }
        } catch {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
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
                    disabled={loading || isSubscribed}
                />
                <Button
                    type="submit"
                    disabled={isSubscribed || loading}
                    size="sm"
                    className="h-9 w-full"
                >
                    {loading ? (
                        'Gönderiliyor...'
                    ) : isSubscribed ? (
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
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            {success && (
                <p className="mt-2 text-xs text-green-600">
                    Onay maili gönderildi. Lütfen e-posta kutunuzu kontrol edin.
                </p>
            )}
            <p className="text-muted-foreground mt-2 text-xs">
                İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
        </div>
    );
}
