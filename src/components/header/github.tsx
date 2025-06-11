import { Suspense } from 'react';

import SmallLoading from '@/components/shared/small-loading';
import { Button } from '@/components/ui/button';
import { GitHubIcon } from '@/icons/github';

export const GithubButton = () => {
    const githubUrl = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        window.open('https://github.com/mustafagenc/nitrokit', '_blank');
    };

    return (
        <Suspense fallback={<SmallLoading />}>
            <Button
                size="icon"
                variant="outline"
                className="hidden cursor-pointer rounded-full text-gray-500 hover:text-gray-700 lg:inline-flex"
                onClick={githubUrl}
            >
                <GitHubIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
        </Suspense>
    );
};
