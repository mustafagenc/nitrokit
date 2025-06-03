import { BaseEmail, emailStyles } from '@/components/emails/base-email';
import { Text, Button, Hr, Section } from '@react-email/components';

interface WelcomeEmailProps {
    name: string;
    dashboardUrl?: string;
}

export function WelcomeEmail({ name, dashboardUrl }: WelcomeEmailProps) {
    return (
        <BaseEmail
            preview="Welcome to Nitrokit! Your account is now active 🚀"
            headerTitle="Welcome to Nitrokit! 🚀"
            headerGradient="linear-gradient(135deg, #4ade80 0%, #22c55e 100%)">
            <Text style={emailStyles.greeting}>Welcome {name}! 🎉</Text>

            <Text style={emailStyles.paragraph}>
                Your email has been verified and your account is now active! You&apos;re all set to
                start exploring Nitrokit&apos;s powerful features.
            </Text>

            <Text style={emailStyles.paragraph}>Here&apos;s what you can do now:</Text>

            <Section style={featureList}>
                <Text style={featureItem}>✨ Build blazing-fast applications</Text>
                <Text style={featureItem}>🔧 Use pre-built components and utilities</Text>
                <Text style={featureItem}>🚀 Deploy with confidence</Text>
                <Text style={featureItem}>📊 Monitor your projects in real-time</Text>
            </Section>

            {dashboardUrl && (
                <Section style={emailStyles.buttonContainer}>
                    <Button
                        href={dashboardUrl}
                        style={{
                            ...emailStyles.button,
                            backgroundColor: '#22c55e',
                        }}>
                        🎯 Go to Dashboard
                    </Button>
                </Section>
            )}

            <Text style={emailStyles.paragraph}>
                Need help getting started? Check out our documentation or reach out to our support
                team.
            </Text>

            <Hr style={emailStyles.hr} />

            <Text style={emailStyles.footer}>
                Thanks for joining Nitrokit! If you have any questions, feel free to reply to this
                email. We&apos;re here to help you succeed! 💪
            </Text>
        </BaseEmail>
    );
}

const featureList = {
    margin: '20px 0',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
};

const featureItem = {
    fontSize: '16px',
    color: '#374151',
    margin: '8px 0',
    display: 'block',
};
