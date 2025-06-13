'use client';

import { useTranslations } from 'next-intl';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PasswordRequirement {
    label: string;
    met: boolean;
}

interface PasswordStrengthIndicatorProps {
    password: string;
    showRequirements?: boolean;
    showWarning?: boolean;
    className?: string;
}

export function PasswordStrengthIndicator({
    password,
    showRequirements = true,
    showWarning = true,
    className = '',
}: PasswordStrengthIndicatorProps) {
    const t = useTranslations('components.passwordStrength');

    const calculatePasswordStrength = (password: string) => {
        if (!password) return { score: 0, level: 'weak' as const };

        let score = 0;

        // Length checks
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;

        // Character type checks
        if (/[A-Z]/.test(password)) score += 15;
        if (/[a-z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;

        let level: 'weak' | 'medium' | 'strong';
        if (score >= 80) level = 'strong';
        else if (score >= 60) level = 'medium';
        else level = 'weak';

        return { score, level };
    };

    const getPasswordRequirements = (password: string): PasswordRequirement[] => [
        {
            label: t('requirements.minLength'),
            met: password.length >= 8,
        },
        {
            label: t('requirements.uppercase'),
            met: /[A-Z]/.test(password),
        },
        {
            label: t('requirements.lowercase'),
            met: /[a-z]/.test(password),
        },
        {
            label: t('requirements.number'),
            met: /[0-9]/.test(password),
        },
        {
            label: t('requirements.special'),
            met: /[^A-Za-z0-9]/.test(password),
        },
    ];

    const getStrengthText = (level: string) => {
        switch (level) {
            case 'strong':
                return { text: t('strength.strong'), color: 'text-green-600' };
            case 'medium':
                return { text: t('strength.medium'), color: 'text-yellow-600' };
            case 'weak':
                return { text: t('strength.weak'), color: 'text-red-600' };
            default:
                return { text: t('strength.veryWeak'), color: 'text-gray-500' };
        }
    };

    const getProgressColor = (level: string) => {
        switch (level) {
            case 'strong':
                return '[&>div]:bg-green-500';
            case 'medium':
                return '[&>div]:bg-yellow-500';
            case 'weak':
                return '[&>div]:bg-red-500';
            default:
                return '[&>div]:bg-gray-400';
        }
    };

    const passwordStrength = calculatePasswordStrength(password);
    const passwordRequirements = getPasswordRequirements(password);
    const strengthText = getStrengthText(passwordStrength.level);

    if (!password) return null;

    return (
        <div className={`space-y-3 pt-2 ${className}`}>
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('labels.passwordStrength')}</Label>
                <span className={`text-sm font-medium ${strengthText.color}`}>
                    {strengthText.text}
                </span>
            </div>

            <div className="space-y-2">
                <Progress
                    value={passwordStrength.score}
                    className={`h-2 ${getProgressColor(passwordStrength.level)}`}
                />
                <div className="text-muted-foreground text-right text-xs">
                    {t('labels.strengthPercentage', { percentage: passwordStrength.score })}
                </div>
            </div>

            {showRequirements && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">{t('labels.requirements')}</Label>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {passwordRequirements.map((requirement, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {requirement.met ? (
                                    <CheckCircle className="h-3 w-3 flex-shrink-0 text-green-600" />
                                ) : (
                                    <XCircle className="h-3 w-3 flex-shrink-0 text-gray-400" />
                                )}
                                <span
                                    className={`text-xs ${
                                        requirement.met ? 'text-green-600' : 'text-gray-500'
                                    }`}
                                >
                                    {requirement.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showWarning && passwordStrength.level === 'weak' && password.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    <div className="text-sm">
                        <p className="font-medium text-red-800">{t('warning.title')}</p>
                        <p className="text-red-700">{t('warning.description')}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export function usePasswordStrength(password: string) {
    const t = useTranslations('components.passwordStrength');

    const calculatePasswordStrength = (password: string) => {
        if (!password) return { score: 0, level: 'weak' as const };

        let score = 0;

        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10;
        if (password.length >= 16) score += 10;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[a-z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;

        let level: 'weak' | 'medium' | 'strong';
        if (score >= 80) level = 'strong';
        else if (score >= 60) level = 'medium';
        else level = 'weak';

        return { score, level };
    };

    const getPasswordRequirements = (password: string) => [
        { label: t('requirements.minLength'), met: password.length >= 8 },
        { label: t('requirements.uppercase'), met: /[A-Z]/.test(password) },
        { label: t('requirements.lowercase'), met: /[a-z]/.test(password) },
        { label: t('requirements.number'), met: /[0-9]/.test(password) },
        { label: t('requirements.special'), met: /[^A-Za-z0-9]/.test(password) },
    ];

    const strength = calculatePasswordStrength(password);
    const requirements = getPasswordRequirements(password);
    const allRequirementsMet = requirements.every((req) => req.met);

    return {
        strength,
        requirements,
        allRequirementsMet,
        isStrong: strength.level === 'strong',
        isMedium: strength.level === 'medium',
        isWeak: strength.level === 'weak',
    };
}
