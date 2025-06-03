import { NextRequest, NextResponse } from 'next/server';
import { del, put } from '@vercel/blob';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        const contentType = request.headers.get('content-type');

        if (!contentType || !allowedTypes.includes(contentType)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
                { status: 400 }
            );
        }

        const body = await request.arrayBuffer();

        if (body.byteLength > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            );
        }

        const timestamp = Date.now();
        const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '');
        const uniqueFilename = `avatars/${session.user.id}/${timestamp}-${cleanFilename}`;

        const currentUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { image: true },
        });

        const blob = await put(uniqueFilename, body, {
            access: 'public',
            contentType,
        });

        if (currentUser?.image) {
            await del(currentUser.image); // Vercel Blob delete
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: blob.url },
        });

        return NextResponse.json({
            success: true,
            url: blob.url,
            message: 'Image uploaded successfully',
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
    }
}
