import {
    BiLogoFacebookCircle,
    BiLogoGithub,
    BiLogoInstagram,
    BiLogoLinkedin,
} from 'react-icons/bi';

const PUBLIC_MAIL = 'info@ekipisi.com.tr';

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

export { PUBLIC_MAIL, SOCIAL_LINKS };
