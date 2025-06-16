import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';
import { auth } from '@/lib/auth';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
];

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const ticket = await prisma.ticket.findUnique({
            where: { id: await id },
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        if (ticket.status === 'CLOSED') {
            return NextResponse.json(
                { error: 'Cannot add attachments to closed ticket' },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const messageId = formData.get('messageId') as string | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'File type not allowed' }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size too large' }, { status: 400 });
        }

        const blob = await put(file.name, file, {
            access: 'public',
            addRandomSuffix: true,
        });

        const attachment = await prisma.ticketAttachment.create({
            data: {
                ticketId: messageId ? null : id,
                messageId: messageId || null,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileUrl: blob.url,
            },
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
