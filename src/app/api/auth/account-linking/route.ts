// src/app/api/auth/account-linking/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const {
            provider,
            providerAccountId,
            accessToken,
            refreshToken,
            tokenType,
            scope,
            expiresAt,
        } = await req.json();

        // Gerekli alanları kontrol et
        if (!provider || !providerAccountId) {
            return NextResponse.json(
                { error: 'Provider ve providerAccountId gerekli' },
                { status: 400 }
            );
        }

        // Mevcut kullanıcıyı bul
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { accounts: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Bu provider ile zaten bağlı hesap var mı?
        const existingAccountSameProvider = user.accounts.find((acc) => acc.provider === provider);

        if (existingAccountSameProvider) {
            return NextResponse.json(
                { error: 'Bu platform ile zaten bir hesap bağlı' },
                { status: 400 }
            );
        }

        // Bu provider account başka kullanıcıda var mı?
        const existingAccountOtherUser = await prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId,
                },
            },
            include: {
                user: {
                    select: { id: true, email: true },
                },
            },
        });

        if (existingAccountOtherUser && existingAccountOtherUser.userId !== user.id) {
            return NextResponse.json(
                { error: 'Bu hesap başka bir kullanıcıya ait' },
                { status: 409 }
            );
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
                token_type: tokenType || 'bearer',
                scope: scope,
                expires_at: expiresAt ? Math.floor(expiresAt / 1000) : null, // Unix timestamp
            },
        });

        // Güncellenmiş hesap listesini döndür
        const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                accounts: {
                    select: {
                        provider: true,
                        type: true,
                        createdAt: true,
                    },
                },
            },
        });

        return NextResponse.json({
            message: 'Hesap başarıyla bağlandı',
            linkedAccounts: updatedUser?.accounts || [],
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

        if (!provider) {
            return NextResponse.json({ error: 'Provider gerekli' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { accounts: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const accountToDelete = user.accounts.find((acc) => acc.provider === provider);

        if (!accountToDelete) {
            return NextResponse.json({ error: 'Böyle bir bağlantı bulunamadı' }, { status: 404 });
        }

        const hasPassword = !!user.password;
        const accountCount = user.accounts.length;

        if (!hasPassword && accountCount <= 1) {
            return NextResponse.json(
                {
                    error: 'Son giriş yönteminizi kaldıramazsınız. Önce bir şifre belirleyin.',
                },
                { status: 400 }
            );
        }

        await prisma.account.delete({
            where: {
                id: accountToDelete.id,
            },
        });

        const updatedUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                accounts: {
                    select: {
                        provider: true,
                        type: true,
                        createdAt: true,
                    },
                },
            },
        });

        return NextResponse.json({
            message: 'Hesap bağlantısı başarıyla kaldırıldı',
            linkedAccounts: updatedUser?.accounts || [],
        });
    } catch (error) {
        console.error('Hesap kaldırma hatası:', error);
        return NextResponse.json({ error: 'Hesap kaldırılırken bir hata oluştu' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                password: true,
                accounts: {
                    select: {
                        provider: true,
                        type: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            linkedAccounts: user.accounts,
            hasPassword: !!user.password,
            canRemoveAccounts: !!user.password || user.accounts.length > 1,
        });
    } catch (error) {
        console.error('Hesap listeleme hatası:', error);
        return NextResponse.json(
            { error: 'Hesaplar listelenirken bir hata oluştu' },
            { status: 500 }
        );
    }
}
