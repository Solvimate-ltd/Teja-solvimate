import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import DBConnect from '../../../lib/db';
import User from "../../../models/User";

export async function POST(request) {
    try {
        const body = await request.json();
        const { fullName, email, password } = body;

        if (!fullName || !email || !password) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
        }

        await DBConnect();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const serializedCookie = cookie.serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/', // it makes cookie available for all routes of same site.
        });

        const response = NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                },
            },
            { status: 201 }
        );

        response.headers.set('Set-Cookie', serializedCookie);
        return response;

    } catch (error) {
        console.log("Error in Sign up API ", error.message);
        return NextResponse.json(
            { message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}

export function GET() {
    return NextResponse.json({ message: 'Only POST requests allowed' }, { status: 405 });
}



