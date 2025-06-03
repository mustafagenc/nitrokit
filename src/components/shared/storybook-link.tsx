import { Link } from '@/lib/i18n/navigation';

function StorybookLink() {
    return (
        <Link
            href="/storybook/"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            target="_blank"
            rel="noopener noreferrer">
            📖 View Storybook
        </Link>
    );
}
export default StorybookLink;
