import { Link } from '@/lib/i18n/navigation';

import { InfoTooltip } from '@/components/shared/info-tooltip';
import { SOCIAL_LINKS } from '@/constants/site';

export const SocialIcons = () => {
    return (
        <div className="flex place-items-center gap-4 lg:grid-cols-10">
            {SOCIAL_LINKS.map((link) => (
                <InfoTooltip key={link.name} label={link.name} side="bottom" className="text-xs">
                    <Link
                        href={link.url}
                        rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-xl p-1 text-gray-600 transition-colors duration-200 ease-in-out hover:text-blue-600 dark:hover:text-gray-400"
                        aria-label={link.name}
                        target="_blank"
                    >
                        {link.icon({
                            className: 'w-7 h-7',
                        })}
                    </Link>
                </InfoTooltip>
            ))}
        </div>
    );
};
