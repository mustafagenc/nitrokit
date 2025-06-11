'use client';

import { Globe } from 'lucide-react';
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';

import SmallLoading from '@/components/shared/small-loading';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { localesWithFlag } from '@/constants/locale';
import { usePathname, useRouter } from '@/lib/i18n/navigation';

export const LocaleSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleChange = (value: string) => {
        router.push(pathname, { locale: value });
        router.refresh();
    };

    if (!mounted) {
        return <SmallLoading />;
    }

    return (
        <Suspense fallback={<SmallLoading />}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        size="icon"
                        variant="outline"
                        className="cursor-pointer rounded-full text-gray-500 hover:text-gray-700"
                    >
                        <Globe className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-35 p-1 shadow-xs" side="bottom">
                    {localesWithFlag.map((elt) => (
                        <div
                            key={elt.id}
                            className="flex cursor-pointer flex-row items-center gap-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                                handleChange(elt.id);
                                setOpen(false);
                            }}
                        >
                            <div className="flex">
                                <Image
                                    src={elt.flag}
                                    width={16}
                                    height={16}
                                    alt={elt.name}
                                    className="w-4"
                                />
                            </div>
                            <div className="text-sm">{elt.name}</div>
                        </div>
                    ))}
                </PopoverContent>
            </Popover>
        </Suspense>
    );
};
