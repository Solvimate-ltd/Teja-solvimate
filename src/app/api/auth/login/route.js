<<<<<<< HEAD
=======
<<<<<<< HEAD
// app/api/login/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
=======
>>>>>>> master
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import Admin from '@/app/models/Admin';
import QA from '@/app/models/QA';
import Candidate from '@/app/models/Candidate';
<<<<<<< HEAD
import Language from '@/app/models/Language';
=======
>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

<<<<<<< HEAD
=======
<<<<<<< HEAD

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
=======
>>>>>>> master
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

<<<<<<< HEAD
        const token = jwt.sign(
            { userId: user._id },
=======



        const token = jwt.sign(
            { userId: user._id },
>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log("Here I'm sending role:", user.role)

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
<<<<<<< HEAD
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                isBlocked: user.isBlocked,
            },
        });

=======
<<<<<<< HEAD
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
        });


=======
                fullName: user.fullName,
                email: user.email,
                role: user.role
            },
        });

>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master
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
<<<<<<< HEAD
}
=======
<<<<<<< HEAD
}
=======
}
>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master
