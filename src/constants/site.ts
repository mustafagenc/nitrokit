import {
    BiLogoFacebookCircle,
    BiLogoGithub,
    BiLogoInstagram,
    BiLogoLinkedin,
} from 'react-icons/bi';

const PUBLIC_MAIL = 'info@ekipisi.com.tr';

const ROUTES = ['', 'about', 'services', 'pricing', 'blog', 'contact'];

const NAV_LINKS = [
    { name: 'navigation.home', path: '/' },
    { name: 'navigation.about', path: '/about/' },
    { name: 'navigation.services', path: '/services/' },
    { name: 'navigation.pricing', path: '/pricing/' },
    { name: 'navigation.blog', path: '/blog/' },
    { name: 'navigation.contact', path: '/contact/' },
];

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

export { PUBLIC_MAIL, ROUTES, NAV_LINKS, SOCIAL_LINKS };
