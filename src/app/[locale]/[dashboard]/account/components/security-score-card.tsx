import { Link } from '@/lib/i18n/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SecurityScoreCardProps {
    securityScore: number;
}

export const SecurityScoreCard = ({ securityScore }: SecurityScoreCardProps) => {
    const t = useTranslations('dashboard.account.security');

    const getScoreVariant = () => {
        if (securityScore >= 80) return 'default';
        if (securityScore >= 60) return 'secondary';
        return 'destructive';
    };

    const getScoreClassName = () => {
        if (securityScore >= 80) return 'bg-green-500 hover:bg-green-600';
        if (securityScore >= 60) return 'bg-yellow-500 hover:bg-yellow-600';
        return 'bg-red-500 hover:bg-red-600';
    };

    const getScoreText = () => {
        if (securityScore >= 80) return t('score.excellent');
        if (securityScore >= 60) return t('score.good');
        return t('score.needsImprovement');
    };

    return (
        <Card className="bg-[url(/images/bg/bg-5.png)] bg-[length:700px] bg-[center_top_1.3rem] bg-no-repeat lg:col-span-1 dark:bg-[url(/images/bg/bg-5-dark.png)]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="flex w-full items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {t('score.title')}
                        <Badge variant={getScoreVariant()} className={getScoreClassName()}>
                            {getScoreText()}
                        </Badge>
                    </div>
                    <div>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href="/dashboard/account/security">
                                    <Settings className="h-5 w-5" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('score.settings')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-4 overflow-hidden">
                <div className="text-center">
                    <div className="text-3xl font-bold">{securityScore}%</div>
                    <p className="text-muted-foreground text-sm">{t('score.subtitle')}</p>
                </div>
                <Progress value={securityScore} className="mb-6 h-2" />
            </CardContent>
        </Card>
    );
};
