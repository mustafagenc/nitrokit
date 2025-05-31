import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { User, Settings, CreditCard, LogOut, HelpCircle } from 'lucide-react';

const user = {
    name: 'Mustafa Genç',
    email: 'mustafa@nitrokit.dev',
    avatar: 'https://github.com/mustafagenc.png',
    initials: 'MG',
};

const menuItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: CreditCard, label: 'Billing', href: '/billing' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Support', href: '/support' },
];

export function UserMenu() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:bg-white hover:shadow-sm dark:hover:bg-zinc-800">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs text-white">
                            {user.initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end" sideOffset={8}>
                <div className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-xs leading-none">{user.email}</p>
                    </div>
                </div>
                <Separator />
                <div className="p-2">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <Button
                                key={item.label}
                                variant="ghost"
                                className="h-auto w-full justify-start rounded-lg px-3 py-2"
                                asChild>
                                <a href={item.href}>
                                    <Icon className="mr-2 h-4 w-4" />
                                    <span className="text-sm">{item.label}</span>
                                </a>
                            </Button>
                        );
                    })}
                </div>
                <Separator />
                <div className="p-2">
                    <Button
                        variant="ghost"
                        className="h-auto w-full justify-start rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span className="text-sm">Log out</span>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
