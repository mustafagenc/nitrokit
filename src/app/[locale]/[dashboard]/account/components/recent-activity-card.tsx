import { useFormatter, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, SquareArrowOutUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { UserActivity } from '@/types/activity';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface RecentActivityCardProps {
    activities: UserActivity[];
}

export const RecentActivityCard = ({ activities }: RecentActivityCardProps) => {
    const t = useTranslations('dashboard.account');
    const format = useFormatter();

    const getActivityIconClassName = (status: UserActivity['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
            case 'completed':
                return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'expires-soon':
                return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
            default:
                return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getActivityBadgeClassName = (status: UserActivity['status']) => {
        switch (status) {
            case 'active':
                return 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'completed':
                return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'expires-soon':
                return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getStatusText = (status: UserActivity['status']) => {
        switch (status) {
            case 'active':
                return t('recentActivity.statuses.active');
            case 'completed':
                return t('recentActivity.statuses.completed');
            case 'expires-soon':
                return t('recentActivity.statuses.expiresSoon');
            default:
                return t('recentActivity.statuses.unknown');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="flex w-full items-center gap-2">
                        <Clock className="h-5 w-5" />
                        {t('recentActivity.title')}
                    </div>
                    <div>
                        <Tooltip>
                            <TooltipTrigger>
                                <Link href="/dashboard/account/security/sessions">
                                    <SquareArrowOutUpRight className="h-5 w-5" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('recentActivity.viewAllSessions')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {activities.length > 0 ? (
                        activities.map((activity) => {
                            const IconComponent = activity.icon;
                            return (
                                <div
                                    key={activity.id}
                                    className="border-muted flex items-center justify-between border-l-2 py-0 pl-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`rounded-full p-2 ${getActivityIconClassName(activity.status)}`}
                                        >
                                            <IconComponent className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{activity.title}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {activity.description}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                {format.dateTime(activity.timestamp, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${getActivityBadgeClassName(activity.status)}`}
                                    >
                                        {getStatusText(activity.status)}
                                    </Badge>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-8 text-center">
                            <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                            <p className="text-muted-foreground text-sm">
                                {t('recentActivity.noActivity')}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
