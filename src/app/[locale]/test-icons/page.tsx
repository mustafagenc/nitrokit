import {
    AppleIcon,
    AtlassianIcon,
    AuthjsIcon,
    AzureAdIcon,
    DiscordIcon,
    DribbbleIcon,
    FacebookIcon,
    GitlabIcon,
    GithubIcon,
    GoogleIcon,
    InstagramIcon,
    LinkedinIcon,
    MailchimpIcon,
    MailgunIcon,
    MailruIcon,
    MastodonIcon,
    MicrosoftEntraIdIcon,
    NodemailerIcon,
    PasskeyIcon,
    PatreonIcon,
    PinterestIcon,
    ResendIcon,
    RobloxIcon,
    SalesforceIcon,
    SimpleLoginIcon,
    SlackIcon,
    SpotifyIcon,
    ThreadsIcon,
    TiktokIcon,
    TwitterIcon,
    VkIcon,
    WechatIcon,
    YandexIcon,
    ZoomIcon,
} from '@/components/icons/brands';

export default function TestIconsPage() {
    const icons = [
        { name: 'Apple', Icon: AppleIcon },
        { name: 'Atlassian', Icon: AtlassianIcon },
        { name: 'Authjs', Icon: AuthjsIcon },
        { name: 'Azure AD', Icon: AzureAdIcon },
        { name: 'Discord', Icon: DiscordIcon },
        { name: 'Dribbble', Icon: DribbbleIcon },
        { name: 'Facebook', Icon: FacebookIcon },
        { name: 'Gitlab', Icon: GitlabIcon },
        { name: 'Github', Icon: GithubIcon },
        { name: 'Google', Icon: GoogleIcon },
        { name: 'Instagram', Icon: InstagramIcon },
        { name: 'LinkedIn', Icon: LinkedinIcon },
        { name: 'Mailchimp', Icon: MailchimpIcon },
        { name: 'Mailgun', Icon: MailgunIcon },
        { name: 'Mail.ru', Icon: MailruIcon },
        { name: 'Mastodon', Icon: MastodonIcon },
        { name: 'Microsoft Entra ID', Icon: MicrosoftEntraIdIcon },
        { name: 'Nodemailer', Icon: NodemailerIcon },
        { name: 'Passkey', Icon: PasskeyIcon },
        { name: 'Patreon', Icon: PatreonIcon },
        { name: 'Pinterest', Icon: PinterestIcon },
        { name: 'Resend', Icon: ResendIcon },
        { name: 'Roblox', Icon: RobloxIcon },
        { name: 'Salesforce', Icon: SalesforceIcon },
        { name: 'SimpleLogin', Icon: SimpleLoginIcon },
        { name: 'Slack', Icon: SlackIcon },
        { name: 'Spotify', Icon: SpotifyIcon },
        { name: 'Threads', Icon: ThreadsIcon },
        { name: 'TikTok', Icon: TiktokIcon },
        { name: 'Twitter', Icon: TwitterIcon },
        { name: 'VK', Icon: VkIcon },
        { name: 'WeChat', Icon: WechatIcon },
        { name: 'Yandex', Icon: YandexIcon },
        { name: 'Zoom', Icon: ZoomIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl">
                <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
                    İkon Test Sayfası
                </h1>

                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
                    {icons.map(({ name, Icon }) => (
                        <div
                            key={name}
                            className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
                        >
                            <div className="mb-4 h-16 w-16">
                                <Icon className="h-full w-full" />
                            </div>
                            <div className="mb-4 h-16 w-16">
                                <Icon className="h-full w-full" color="#000000" />
                            </div>
                            <div className="mb-4 h-16 w-16">
                                <Icon className="h-full w-full" color="#ffffff" />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
