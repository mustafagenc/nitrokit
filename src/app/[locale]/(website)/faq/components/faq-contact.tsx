import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, ExternalLink } from 'lucide-react';

interface FAQContactProps {
    title?: string;
    description?: string;
    emailHref?: string;
    contactHref?: string;
}

export function FAQContact({
    title = 'Hala yardıma mı ihtiyacınız var?',
    description = 'Cevabını bulamadığınız sorular için bizimle iletişime geçin.',
    emailHref = 'mailto:support@nitrokit.dev',
    contactHref = '/contact',
}: FAQContactProps) {
    return (
        <div className="from-primary/5 to-secondary/5 border-border/50 rounded-lg border bg-gradient-to-br p-6">
            <div className="text-center">
                <MessageCircle className="text-primary mx-auto mb-3 h-8 w-8" />
                <h3 className="text-foreground mb-2 font-semibold">{title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{description}</p>
                <div className="space-y-2">
                    <Button size="sm" className="w-full" asChild>
                        <a href={emailHref}>
                            <Mail className="mr-2 h-4 w-4" />
                            E-posta Gönder
                        </a>
                    </Button>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                        <a href={contactHref}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            İletişim Formu
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
