import Image from 'next/image';

import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SignWithResend() {
    return (
        <form
            action={async formData => {
                'use server';
                await signIn('resend', formData);
            }}>
            <Input name="email" type="email"></Input>
            <Button
                aria-label="Sign in with Google"
                className="cursor-pointer items-center justify-center border-1 border-gray-300 bg-white hover:bg-gray-100"
                type="submit">
                <Image
                    src={'/images/brands/resend.svg'}
                    alt="Resend"
                    width={18}
                    height={18}
                    className="h-5 w-5"
                />
                <span className="text-sm text-black">Signin with Resend</span>
            </Button>
        </form>
    );
}
