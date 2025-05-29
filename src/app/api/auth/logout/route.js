export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export async function POST(req) {
  const serialized = cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  const response = NextResponse.json({ message: 'Logged out successfully' });

  response.headers.set('Set-Cookie', serialized);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.CORS_ORIGIN || 'https://teja-next-app.onrender.com'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');

  return response;
}

export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.CORS_ORIGIN || 'https://teja-next-app.onrender.com'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');

  return response;
}

export function GET() {
  return NextResponse.json(
    { message: 'Only POST requests allowed' },
    { status: 405 }
  );
}
