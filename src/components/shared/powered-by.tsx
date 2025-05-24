import { getTranslations } from 'next-intl/server';
import { ThemedImage } from './themed-image';

export default async function PoweredBy() {
    const t = await getTranslations('footer');
    return (
        <>
            {t.rich('poweredBy', {
                link: (chunk: React.ReactNode) => (
                    <a href="http://ekipisi.com">
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
        </>
    );
}
