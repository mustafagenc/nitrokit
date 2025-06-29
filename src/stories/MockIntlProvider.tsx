import { NextIntlClientProvider } from 'next-intl';

export function MockIntlProvider({ children }: { children: React.ReactNode }) {
    // Basit bir çeviri objesi, gerçek çeviriye gerek yok
    const messages = {
        components: {
            testimonials: {
                title: 'Testimonials',
                subtitle: 'What our users say',
                description: 'Here are some testimonials from our users.',
            },
            passwordStrength: {
                labels: {
                    passwordStrength: 'Password Strength',
                    requirements: 'Requirements',
                    strengthPercentage: 'Strength: {percentage}%',
                },
                requirements: {
                    minLength: 'At least 8 characters',
                    uppercase: 'At least one uppercase letter',
                    lowercase: 'At least one lowercase letter',
                    number: 'At least one number',
                    special: 'At least one special character',
                },
                strength: {
                    strong: 'Strong',
                    medium: 'Medium',
                    weak: 'Weak',
                    veryWeak: 'Very Weak',
                },
                warning: {
                    title: 'Weak Password',
                    description: 'Your password is too weak. Please use a stronger password.',
                },
            },
        },
    };

    return (
        <NextIntlClientProvider locale="en" messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
}
