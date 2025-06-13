import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../../components/ui/button';
import { Loader2 } from 'lucide-react';
import {
    GoogleIcon,
    GithubIcon,
    GitlabIcon,
    AppleIcon,
    InstagramIcon,
    FacebookIcon,
} from '../../../components/icons/brands';

interface SignWithButtonProps {
    provider: 'google' | 'github' | 'gitlab' | 'apple' | 'instagram' | 'facebook';
    isLoading?: boolean;
    buttonText?: string;
    onlyIcon?: boolean;
    children?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    disabled?: boolean;
    onClick?: () => void;
}

const SignWithButton: React.FC<SignWithButtonProps> = ({
    provider,
    isLoading,
    buttonText,
    children,
    onlyIcon = false,
    variant,
    className,
}) => {
    const providerDetails = {
        google: { Icon: GoogleIcon, name: 'Google' },
        github: { Icon: GithubIcon, name: 'GitHub' },
        gitlab: { Icon: GitlabIcon, name: 'GitLab' },
        apple: { Icon: AppleIcon, name: 'Apple' },
        instagram: { Icon: InstagramIcon, name: 'Instagram' },
        facebook: { Icon: FacebookIcon, name: 'Facebook' },
    };
    const currentProvider = providerDetails[provider];
    const defaultText = `Sign in with ${currentProvider.name}`;
    const displayText = buttonText || defaultText;
    return (
        <Button variant={variant || 'outline'} className={`w-full ${className || ''}`}>
            {isLoading ? (
                <Loader2 className={`size-4 ${onlyIcon ? '' : 'mr-2'} animate-spin`} />
            ) : (
                <currentProvider.Icon className={`size-4 ${onlyIcon ? '' : 'mr-2'}`} />
            )}
            {!onlyIcon && (children || displayText)}
            {onlyIcon && children && <span className="sr-only">{children || displayText}</span>}
        </Button>
    );
};

const meta: Meta<typeof SignWithButton> = {
    title: 'Components/Auth/SignWithButton',
    component: SignWithButton,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        provider: {
            control: 'select',
            options: ['google', 'github', 'gitlab', 'apple', 'instagram', 'facebook'],
        },
        isLoading: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
        buttonText: {
            control: 'text',
            description: 'Custom text for the button. Overrides default "Sign in with {Provider}".',
        },
        onlyIcon: {
            control: 'boolean',
            description: 'If true, only the icon is displayed.',
        },
        children: {
            control: 'text',
            description:
                'Custom content for the button, overrides buttonText and default text if not onlyIcon.',
        },
        onClick: { action: 'clicked' },
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
    },
};

export default meta;

type Story = StoryObj<typeof SignWithButton>;

export const Google: Story = {
    args: {
        provider: 'google',
    },
};

export const GitHub: Story = {
    args: {
        provider: 'github',
    },
};

export const GitLab: Story = {
    args: {
        provider: 'gitlab',
    },
};

export const Apple: Story = {
    args: {
        provider: 'apple',
    },
};

export const Instagram: Story = {
    args: {
        provider: 'instagram',
    },
};

export const Facebook: Story = {
    args: {
        provider: 'facebook',
    },
};

export const OnlyIconGoogle: Story = {
    args: {
        provider: 'google',
        onlyIcon: true,
    },
};

export const OnlyIconGitHub: Story = {
    args: {
        provider: 'github',
        onlyIcon: true,
    },
};

export const LoadingGoogle: Story = {
    args: {
        provider: 'google',
        isLoading: true,
        buttonText: 'Signing in with Google...',
    },
};

export const DisabledApple: Story = {
    args: {
        provider: 'apple',
        disabled: true,
    },
};

export const CustomTextFacebook: Story = {
    args: {
        provider: 'facebook',
        buttonText: 'Continue with Facebook',
    },
};

export const InAForm: Story = {
    render: () => (
        <div className="bg-card text-card-foreground w-80 rounded-lg border p-6 shadow-sm">
            <div className="mb-6 flex flex-col space-y-1.5 p-0 text-center">
                <h3 className="text-2xl font-semibold tracking-tight whitespace-nowrap">
                    Create an Account
                </h3>
                <p className="text-muted-foreground text-sm">
                    Choose your preferred sign-in method.
                </p>
            </div>
            <div className="flex flex-col space-y-3">
                <SignWithButton
                    provider="google"
                    onClick={() => console.log('Google sign-in clicked')}
                />
                <SignWithButton
                    provider="github"
                    onClick={() => console.log('GitHub sign-in clicked')}
                />
                <SignWithButton
                    provider="gitlab"
                    onClick={() => console.log('GitLab sign-in clicked')}
                />
                <SignWithButton
                    provider="apple"
                    onClick={() => console.log('Apple sign-in clicked')}
                />
                <SignWithButton
                    provider="instagram"
                    onClick={() => console.log('Instagram sign-in clicked')}
                />
                <SignWithButton
                    provider="facebook"
                    onClick={() => console.log('Facebook sign-in clicked')}
                />
            </div>
            <p className="text-muted-foreground mt-6 px-0 text-center text-xs">
                By clicking continue, you agree to our{' '}
                <a href="#" className="hover:text-primary underline underline-offset-4">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="hover:text-primary underline underline-offset-4">
                    Privacy Policy
                </a>
                .
            </p>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

export const OnlyIconsInAForm: Story = {
    render: () => (
        <div className="bg-card text-card-foreground w-auto rounded-lg border p-6 shadow-sm">
            <div className="mb-6 flex flex-col space-y-1.5 p-0 text-center">
                <h3 className="text-xl font-semibold tracking-tight whitespace-nowrap">
                    Sign In With
                </h3>
            </div>
            <div className="flex justify-center space-x-3">
                <SignWithButton
                    provider="google"
                    onlyIcon
                    onClick={() => console.log('Google sign-in clicked')}
                    className="w-auto p-2"
                />
                <SignWithButton
                    provider="github"
                    onlyIcon
                    onClick={() => console.log('GitHub sign-in clicked')}
                    className="w-auto p-2"
                />
                <SignWithButton
                    provider="gitlab"
                    onlyIcon
                    onClick={() => console.log('GitLab sign-in clicked')}
                    className="w-auto p-2"
                />
                <SignWithButton
                    provider="apple"
                    onlyIcon
                    onClick={() => console.log('Apple sign-in clicked')}
                    className="w-auto p-2"
                />
                <SignWithButton
                    provider="instagram"
                    onlyIcon
                    onClick={() => console.log('Instagram sign-in clicked')}
                    className="w-auto p-2"
                />
                <SignWithButton
                    provider="facebook"
                    onlyIcon
                    onClick={() => console.log('Facebook sign-in clicked')}
                    className="w-auto p-2"
                />
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};
