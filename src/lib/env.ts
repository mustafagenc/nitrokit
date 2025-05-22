import { z } from 'zod';

import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
    server: {
        RAINDROP_ACCESS_TOKEN: z.string().optional(),
        RAINDROP_COLLECTION_ID: z.string().optional(),
        GOOGLE_SITE_VERIFICATION: z.string().optional(),
        GOOGLE_ANALYTICS: z.string().optional(),
        YANDEX_VERIFICATION: z.string().optional(),
        YANDEX_METRICA: z.string().optional(),
        RESEND_API_KEY: z.string().min(1),
        RESEND_FROM_EMAIL: z
            .string()
            .min(1, { message: 'Email is required.' })
            .email('Invalid email.'),
        RESEND_AUDIENCE_ID: z.string().optional(),
    },
    client: {},
    runtimeEnv: {
        RAINDROP_ACCESS_TOKEN: process.env.RAINDROP_ACCESS_TOKEN,
        RAINDROP_COLLECTION_ID: process.env.RAINDROP_COLLECTION_ID,
        GOOGLE_SITE_VERIFICATION: process.env.GOOGLE_SITE_VERIFICATION,
        GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
        YANDEX_VERIFICATION: process.env.YANDEX_VERIFICATION,
        YANDEX_METRICA: process.env.YANDEX_METRICA,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
        RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID,
    },
});
