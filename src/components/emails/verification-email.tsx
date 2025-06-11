// src/components/emails/verification-email.tsx
import { BaseEmail, emailStyles } from '@/components/emails/base-email';
import { Text, Button, Hr, Section } from '@react-email/components';

interface VerificationEmailProps {
    name: string;
    verificationUrl: string;
}

export function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
    return (
        <BaseEmail
            preview="Verify your email address - Welcome to Nitrokit!"
            headerTitle="Welcome to Nitrokit!"
            headerGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        >
            <Text style={emailStyles.greeting}>Hi {name}! 👋</Text>

            <Text style={emailStyles.paragraph}>
                Thank you for signing up! To complete your registration and secure your account,
                please verify your email address by clicking the button below:
            </Text>

            <Section style={emailStyles.buttonContainer}>
                <Button
                    href={verificationUrl}
                    style={{
                        ...emailStyles.button,
                        backgroundColor: '#667eea',
                    }}
                >
                    ✅ Verify Email Address
                </Button>
            </Section>

            <Text style={emailStyles.linkText}>Or copy and paste this link into your browser:</Text>
            <Text style={emailStyles.link}>{verificationUrl}</Text>

            <Hr style={emailStyles.hr} />

            <Text style={emailStyles.footer}>
                This verification link will expire in 24 hours for security reasons. If you
                didn&apos;t create an account, you can safely ignore this email.
            </Text>
        </BaseEmail>
    );
}
