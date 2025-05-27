import { ThemedImage } from './themed-image';
import { useTranslations } from 'next-intl';

export default function PoweredBy() {
    const t = useTranslations('footer');
    return (
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            {t.rich('poweredBy', {
                link: (chunk: React.ReactNode) => (
                    <a href="http://nitrokit.tr">
                        <ThemedImage
                            lightSrc={'/logo/ekipisi.svg'}
                            darkSrc={'/logo/ekipisi-dark.svg'}
                            alt="Ekipisi Logo"
                            width={16}
                            height={16}
                            className="drop-shadow-sm transition duration-300 ease-in-out hover:scale-110 dark:drop-shadow-md"
                        />
                        <span className="hidden">{chunk}</span>
                    </a>
                ),
            })}
        </div>
    );
}
