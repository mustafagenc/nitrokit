import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new NextResponse('Dosya bulunamadı', { status: 400 });
        }

        // Dosya boyutu kontrolü (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return new NextResponse('Dosya boyutu çok büyük', { status: 400 });
        }

        // Dosya tipi kontrolü
        const allowedTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];

        if (!allowedTypes.includes(file.type)) {
            return new NextResponse('Geçersiz dosya tipi', { status: 400 });
        }

        const fileName = `${uuidv4()}-${file.name}`;
        const { url } = await put(fileName, file, {
            access: 'public',
        });

        return NextResponse.json({
            id: uuidv4(),
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileUrl: url,
        });
    } catch (error) {
        console.error('[UPLOAD_POST]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
