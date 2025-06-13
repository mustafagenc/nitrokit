import { SignWithButton } from '@/components/auth/sign-with-button';
import { providers } from '@/lib/auth/providers';

export const SignWithButtonsCard = () => {
    return (
        <>
            <div className="mt-3 grid w-full grid-cols-3 gap-3 text-center">
                {providers.map((provider) => (
                    <SignWithButton key={provider.id} provider={provider.id} onlyIcon={true} />
                ))}
            </div>
            <hr className="my-3 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
        </>
    );
};
