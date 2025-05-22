import { ThemedImage } from './themed-image';

export default function PoweredBy() {
    return (
        <>
            Powered by{' '}
            <a href="http://ekipisi.com">
                <ThemedImage
                    lightSrc={'/logo/ekipisi.svg'}
                    darkSrc={'/logo/ekipisi-dark.svg'}
                    alt="Ekipişi Logo"
                    width={16}
                    height={16}
                    className="drop-shadow-sm transition duration-300 ease-in-out hover:scale-110 dark:drop-shadow-md"
                />
            </a>
        </>
    );
}
