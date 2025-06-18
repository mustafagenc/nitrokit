import { Layers, Code, Zap, Users } from 'lucide-react';

const ROUTES = ['', 'about', 'services', 'pricing', 'blog', 'contact'];

const NAV_LINKS = [
    { name: 'navigation.home', path: '/' },
    { name: 'navigation.about', path: '/about/' },
    { name: 'navigation.services.title', path: '/services/' },
    { name: 'navigation.pricing', path: '/pricing/' },
    { name: 'navigation.faq', path: '/faq/' },
    { name: 'navigation.contact', path: '/contact/' },
];

const SERVICES = [
    {
        titleKey: 'navigation.services.web_development.title',
        descriptionKey: 'navigation.services.web_development.description',
        href: '/services/web-development',
        icon: Code,
        badgeKey: 'navigation.services.badges.popular',
        color: 'text-blue-500',
    },
    {
        titleKey: 'navigation.services.ui_ux_design.title',
        descriptionKey: 'navigation.services.ui_ux_design.description',
        href: '/services/ui-ux-design',
        icon: Layers,
        badgeKey: 'navigation.services.badges.new',
        color: 'text-purple-500',
    },
    {
        titleKey: 'navigation.services.performance_optimization.title',
        descriptionKey: 'navigation.services.performance_optimization.description',
        href: '/services/performance',
        icon: Zap,
        color: 'text-yellow-500',
    },
    {
        titleKey: 'navigation.services.team_augmentation.title',
        descriptionKey: 'navigation.services.team_augmentation.description',
        href: '/services/team-augmentation',
        icon: Users,
        color: 'text-green-500',
    },
];

const COMPONENTS = [
    {
        titleKey: 'navigation.components.button_components.title',
        descriptionKey: 'navigation.components.button_components.description',
        href: '/components/button',
        icon: '🔘',
        categoryKey: 'navigation.components.categories.form',
    },
    {
        titleKey: 'navigation.components.navigation_components.title',
        descriptionKey: 'navigation.components.navigation_components.description',
        href: '/components/navigation',
        icon: '🧭',
        categoryKey: 'navigation.components.categories.layout',
    },
    {
        titleKey: 'navigation.components.data_display.title',
        descriptionKey: 'navigation.components.data_display.description',
        href: '/components/data-display',
        icon: '📊',
        categoryKey: 'navigation.components.categories.display',
    },
    {
        titleKey: 'navigation.components.form_controls.title',
        descriptionKey: 'navigation.components.form_controls.description',
        href: '/components/forms',
        icon: '📝',
        categoryKey: 'navigation.components.categories.form',
    },
    {
        titleKey: 'navigation.components.modals_overlays.title',
        descriptionKey: 'navigation.components.modals_overlays.description',
        href: '/components/modals',
        icon: '🪟',
        categoryKey: 'navigation.components.categories.overlay',
    },
    {
        titleKey: 'navigation.components.feedback.title',
        descriptionKey: 'navigation.components.feedback.description',
        href: '/components/feedback',
        icon: '💬',
        categoryKey: 'navigation.components.categories.feedback',
    },
];

export { ROUTES, NAV_LINKS, SERVICES, COMPONENTS };
