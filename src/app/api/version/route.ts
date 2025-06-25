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
                version: '1.0.0',
                name: 'nitrokit',
                success: false,
            },
            { status: 500 }
        );
    }
}
