import * as z from 'zod';
import { newTicketFormSchema, ticketMessageFormSchema } from '@/lib/validations/ticket';

export interface Ticket {
    id: string;
    title: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    category: 'TECHNICAL' | 'BILLING' | 'ACCOUNT' | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT';
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
    assignedUser: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    } | null;
}

export interface TicketListProps {
    tickets: Ticket[];
    total: number;
    page: number;
    limit: number;
}

export type NewTicketFormValues = z.infer<typeof newTicketFormSchema>;

export interface TicketMessage {
    id: string;
    message: string;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
    attachments: {
        id: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        fileUrl: string;
    }[];
}

export interface TicketDetails {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TicketDetailsProps {
    ticket: TicketDetails;
}

export interface TicketMessagesProps {
    ticket: {
        id: string;
        status: string;
        messages: TicketMessage[];
    };
}

export interface FileUploadProps {
    files: File[];
    setFiles: (files: File[]) => void;
    maxSize?: number;
    accept?: Record<string, string[]>;
}

export type TicketMessageFormValues = z.infer<typeof ticketMessageFormSchema>;
