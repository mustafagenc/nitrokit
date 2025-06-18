import { NextResponse } from 'next/server';
import packageJson from '../../../../package.json';

export async function GET() {
    try {
        return NextResponse.json({
            version: packageJson.version,
            name: packageJson.name,
            success: true,
        });
    } catch {
        return NextResponse.json(
            {
                error: '0.0.0',
                success: false,
            },
            { status: 500 }
        );
    }
}
