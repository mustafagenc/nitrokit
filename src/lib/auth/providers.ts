export type Provider =
    | 'google'
    | 'github'
    | 'gitlab'
    | 'apple'
    | 'instagram'
    | 'facebook'
    | 'twitter';

export interface ProviderConfig {
    id: Provider;
    name: string;
    logo: string;
}

export const providers: ProviderConfig[] = [
    {
        id: 'google',
        name: 'Google',
        logo: '/images/brands/google.svg',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        logo: '/images/brands/facebook.svg',
    },
    {
        id: 'twitter',
        name: 'Twitter',
        logo: '/images/brands/twitter.svg',
    },
    {
        id: 'github',
        name: 'GitHub',
        logo: '/images/brands/github.svg',
    },
    {
        id: 'gitlab',
        name: 'GitLab',
        logo: '/images/brands/gitlab.svg',
    },
];
