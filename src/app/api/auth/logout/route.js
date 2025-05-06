import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export async function POST() {
    // overriding cookie
    const serialized = cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0), // it will will imedially delete data when browser loads
        path: '/',
    });

    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.headers.set('Set-Cookie', serialized);

    return response;
}

// Optional: Handle other methods (e.g., GET)
export function GET() {
    return NextResponse.json({ message: 'Only POST requests allowed' }, { status: 405 });
}
