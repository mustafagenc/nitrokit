import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

const ticketMessageFormSchema = z.object({
    message: z.string().min(1, 'Mesaj boş olamaz'),
});

export async function POST(request: Request, context: { params: { ticketId: string } }) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await request.formData();
        const message = formData.get('message') as string;
        const files = formData.getAll('files') as File[];

        const validatedData = ticketMessageFormSchema.parse({ message });

        const messageId = crypto.randomUUID();
        const attachments = [];

        // Dosyaları yükle
        for (const file of files) {
            const fileName = `${uuidv4()}-${file.name}`;
            const { url } = await put(fileName, file, {
                access: 'public',
            });

            attachments.push({
                id: crypto.randomUUID(),
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileUrl: url,
            });
        }

        const ticketMessage = await prisma.ticketMessage.create({
            data: {
                id: messageId,
                message: validatedData.message,
                ticketId: await context.params.ticketId,
                userId: session.user.id,
                attachments: {
                    create: attachments,
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                    },
                },
                attachments: true,
            },
        });

        return NextResponse.json(ticketMessage);
    } catch (error) {
        console.error('[TICKET_MESSAGE_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
