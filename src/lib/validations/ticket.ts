import * as z from 'zod';

export const newTicketFormSchema = z.object({
    title: z.string().min(3, 'Başlık en az 3 karakter olmalıdır').max(100),
    description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
    category: z.enum([
        'TECHNICAL',
        'BILLING',
        'ACCOUNT',
        'GENERAL',
        'FEATURE_REQUEST',
        'BUG_REPORT',
    ]),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
});

export const ticketMessageFormSchema = z.object({
    message: z.string().min(1, 'Mesaj boş olamaz'),
});

export type NewTicketFormValues = z.infer<typeof newTicketFormSchema>;
export type TicketMessageFormValues = z.infer<typeof ticketMessageFormSchema>;
