/* eslint-disable @next/next/no-img-element */
import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';

import { getBaseUrl } from '@/utils/helpers';

// export async function GET(request: Request) {
export async function GET() {
    // const { searchParams } = new URL(request.url);
    // const hasTitle = searchParams.has('title');
    // const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : 'My default title';
    const t = await getTranslations();
    const baseUrl = getBaseUrl();
    const logoSize = 170;

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: `url(${baseUrl}/images/bg/patterns/geometry2.png)`,
                }}>
                <div tw="flex">
                    <div tw="flex flex-col w-full py-12 px-4 md:items-center justify-between p-8 ">
                        <p>
                            <img
                                src={`${baseUrl}/logo/ekipisi.svg`}
                                alt="Logo"
                                width={logoSize}
                                height={logoSize}
                                tw="rounded-full"
                                style={{
                                    borderRadius: '50%',
                                    width: `${logoSize}px`,
                                    height: `${logoSize}px`,
                                    objectFit: 'cover',
                                    marginBottom: '20px',
                                }}
                            />
                        </p>
                        <p tw="text-3xl font-bold text-gray-900">
                            {t.rich('auth.slogan1', {
                                span: children => (
                                    <span className="font-extrabold text-red-600">{children}</span>
                                ),
                            })}
                        </p>
                        <p tw="text-3xl font-bold text-gray-900">
                            {t.rich('auth.slogan2', {
                                link: children => (
                                    <a
                                        href="https://github.com/mustafagenc/nitrokit"
                                        target="_blank"
                                        className="text-blue-700 underline underline-offset-2 hover:text-blue-800">
                                        {children}
                                    </a>
                                ),
                            })}
                        </p>
                        <div tw="mt-12 flex text-3xl font-bold text-blue-600">www.nitrokit.tr</div>
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
