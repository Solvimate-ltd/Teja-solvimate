import { NextResponse } from 'next/server';
<<<<<<< HEAD
=======
<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import * as cookie from "cookie";
import DBConnect from '../../../lib/db';
import User from "../../../models/User";
=======
>>>>>>> master
import { CANDIDATE, QUALITY_ASSURANCE } from '../../../constants/role.js';
import DBConnect from '../../../lib/db.js'; // Your database connection function
import Candidate from '../../../models/Candidate'; // Your Candidate model
import QA from '../../../models/QA'; // Your QA model
<<<<<<< HEAD
=======
>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master

export async function POST(request) {
    try {
        const body = await request.json();
<<<<<<< HEAD
        let { fullName, email, password, role, languages } = body;
=======
<<<<<<< HEAD
        const { fullName, email, password } = body;

        if (!fullName || !email || !password) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
=======
        let { fullName, email, password, role, languages } = body;
        console.log(body.languages)
>>>>>>> master

        if (!fullName || !email || !password || !role || !languages || languages.length === 0) {
            return NextResponse.json({ message: 'All basic fields (fullName, email, password, role, languages) are required' }, { status: 400 });
        }

        if (role !== CANDIDATE && role !== QUALITY_ASSURANCE) {
            return NextResponse.json({ message: `Invalid role. Only '${CANDIDATE}' and '${QUALITY_ASSURANCE}' are supported.` }, { status: 400 });
<<<<<<< HEAD
=======
>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master
        }

        await DBConnect();

<<<<<<< HEAD
=======
<<<<<<< HEAD
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
=======
>>>>>>> master
        const candidateExists = await Candidate.findOne({ email });
        const QAExists = await QA.findOne({ email });

        if (candidateExists || QAExists) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        let newUser;
        if (role === CANDIDATE) {
<<<<<<< HEAD
=======
            console.log("candidate")
>>>>>>> master
            newUser = new Candidate({
                fullName,
                email,
                password,
                role,
                languages,
                // In future more field will be extracted
            });
        } else if (role === QUALITY_ASSURANCE) {
            newUser = new QA({
                fullName,
                email,
                password,
                role,
                languages,
                // In future more field will be extracted
            });
        }

        await newUser.save();

        const response = NextResponse.json(
            {
                message: 'User created successfully',
<<<<<<< HEAD
=======
>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master
            },
            { status: 201 }
        );

<<<<<<< HEAD
=======
<<<<<<< HEAD
        response.headers.set('Set-Cookie', serializedCookie);
=======
>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master
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


<<<<<<< HEAD

=======
<<<<<<< HEAD

=======
>>>>>>> c27bcbe (Adding new Files)
>>>>>>> master
