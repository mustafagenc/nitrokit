// src/components/emails/password-reset-email.tsx
import { BaseEmail, emailStyles } from '@/components/emails/base-email';
import { Text, Button, Hr, Section } from '@react-email/components';

interface PasswordResetEmailProps {
    name: string;
    resetUrl: string;
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
    return (
        <BaseEmail
            preview="Reset your password - Nitrokit"
            headerTitle="🔐 Password Reset"
            headerGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <Text style={emailStyles.greeting}>Hi {name}!</Text>

            <Text style={emailStyles.paragraph}>
                We received a request to reset your password. Click the button below to create a new
                password:
            </Text>

            <Section style={emailStyles.buttonContainer}>
                <Button
                    href={resetUrl}
                    style={{
                        ...emailStyles.button,
                        backgroundColor: '#f5576c',
                    }}>
                    🔑 Reset Password
                </Button>
            </Section>

            <Text style={emailStyles.linkText}>Or copy and paste this link into your browser:</Text>
            <Text style={emailStyles.link}>{resetUrl}</Text>

            <Hr style={emailStyles.hr} />

            <Text style={emailStyles.footer}>
                This reset link will expire in 1 hour for security reasons. If you didn&apos;t
                request this reset, you can safely ignore this email.
            </Text>
        </BaseEmail>
    );
}
