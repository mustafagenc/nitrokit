import { LucideIcon } from 'lucide-react';

export interface UserActivity {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: Date;
    icon: LucideIcon;
    status: 'active' | 'completed' | 'expires-soon' | 'unknown';
}
