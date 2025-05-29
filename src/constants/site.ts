import {
    BiLogoFacebookCircle,
    BiLogoGithub,
    BiLogoInstagram,
    BiLogoLinkedin,
} from 'react-icons/bi';

const PUBLIC_MAIL = 'hello@nitrokit.tr';
const GITHUB_URL = 'https://github.com/mustafagenc/nitrokit';
const VERCEL_DEPLOY_URL =
    'https://vercel.com/new/import?s=https%3A%2F%2Fgithub.com%2Fmustafagenc%2Fnitrokit&hasTrialAvailable=0&showOptionalTeamCreation=false&project-name=nitrokit&framework=nextjs&buildCommand=prisma+generate+--no-engine+%26%26+next+build+%26%26+storybook+build+-o+storybook-static+--quiet+%26%26+mkdir+-p+public%2Fstorybook+%26%26+cp+-r+storybook-static%2F*+public%2Fstorybook%2F&totalProjects=1&remainingProjects=1&teamSlug=mustafa-genc';
const VERCEL_PREVIEW_URL = 'https://dev.nitrokit.tr/';

const SOCIAL_LINKS = [
    {
        name: 'instagram',
        url: 'https://www.instagram.com/ekipisiyazilim',
        icon: BiLogoInstagram,
    },
    {
        name: 'facebook',
        url: 'https://www.facebook.com/ekipisi',
        icon: BiLogoFacebookCircle,
    },
    {
        name: 'linkedin',
        url: 'https://www.linkedin.com/company/ekipisi',
        icon: BiLogoLinkedin,
    },
    {
        name: 'github',
        url: 'https://github.com/ekipisi',
        icon: BiLogoGithub,
    },
];

export { PUBLIC_MAIL, SOCIAL_LINKS, GITHUB_URL, VERCEL_DEPLOY_URL, VERCEL_PREVIEW_URL };
