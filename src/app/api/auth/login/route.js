import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import Admin from '@/app/models/Admin';
import QA from '@/app/models/QA';
import Candidate from '@/app/models/Candidate';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        await dbConnect();

        let user = null;

        user = await Admin.findOne({ email });
        if (!user) {
            user = await QA.findOne({ email });
            if (!user) {
                user = await Candidate.findOne({ email });
                if (!user) {
                    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
                }
            }
        }




        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
        });

        response.headers.set(
            'Set-Cookie',
            cookie.serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: '/',
            })
        );

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Something went wrong. Please try again later.' },
            { status: 500 }
        );
    }
}


export function GET() {
    return NextResponse.json({ message: 'Only POST requests allowed' }, { status: 405 });
}
