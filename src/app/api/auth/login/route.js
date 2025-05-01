// app/api/login/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }


        await dbConnect();

        const user = await User.findOne({ email });
        if (!user) {
            console.log("ifndanfa")
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 400 });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
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
