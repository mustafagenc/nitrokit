import { useFormatter, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, Calendar } from 'lucide-react';
import { User } from 'prisma/generated/prisma';

interface PersonalInfoCardProps {
    user: User;
}

export const PersonalInfoCard = ({ user }: PersonalInfoCardProps) => {
    const t = useTranslations('dashboard.account');
    const format = useFormatter();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    {t('personalInfo.title')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div>
                    <label className="text-muted-foreground text-sm font-medium">
                        {t('personalInfo.fullName')}
                    </label>
                    <p className="text-sm">{user.name || t('personalInfo.notSet')}</p>
                </div>

                <div>
                    <label className="text-muted-foreground text-sm font-medium">
                        {t('personalInfo.emailAddress')}
                    </label>
                    <p className="text-sm">{user.email}</p>
                </div>

                <div>
                    <label className="text-muted-foreground text-sm font-medium">
                        {t('personalInfo.phoneNumber')}
                    </label>
                    <p className="text-sm">{user.phone || t('personalInfo.notAdded')}</p>
                </div>

                <div>
                    <label className="text-muted-foreground flex items-center gap-1 text-sm font-medium">
                        <Calendar className="h-3 w-3" />
                        {t('personalInfo.memberSince')}
                    </label>
                    <p className="text-sm">
                        {format.dateTime(user.createdAt, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
