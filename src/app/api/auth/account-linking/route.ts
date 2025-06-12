import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const { provider, providerAccountId, accessToken, refreshToken } = await req.json();

        // Mevcut kullanıcıyı bul
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { accounts: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Hesap zaten bağlı mı kontrol et
        const existingAccount = user.accounts.find((acc) => acc.provider === provider);

        if (existingAccount) {
            return NextResponse.json({ error: 'Bu hesap zaten bağlı' }, { status: 400 });
        }

        // Yeni hesabı bağla
        await prisma.account.create({
            data: {
                userId: user.id,
                type: 'oauth',
                provider,
                providerAccountId,
                access_token: accessToken,
                refresh_token: refreshToken,
            },
        });

        return NextResponse.json({
            message: 'Hesap başarıyla bağlandı',
        });
    } catch (error) {
        console.error('Hesap bağlama hatası:', error);
        return NextResponse.json({ error: 'Hesap bağlanırken bir hata oluştu' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const { provider } = await req.json();

        // Hesabı kaldır
        await prisma.account.deleteMany({
            where: {
                userId: session.user.id,
                provider,
            },
        });

        return NextResponse.json({
            message: 'Hesap başarıyla kaldırıldı',
        });
    } catch (error) {
        console.error('Hesap kaldırma hatası:', error);
        return NextResponse.json({ error: 'Hesap kaldırılırken bir hata oluştu' }, { status: 500 });
    }
}
