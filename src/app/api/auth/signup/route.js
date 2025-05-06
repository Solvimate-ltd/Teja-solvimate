import { NextResponse } from 'next/server';
import { CANDIDATE, QUALITY_ASSURANCE } from '../../../database/constants/role.js';
import DBConnect from '../../../database/lib/db.js'; // Your database connection function
import Candidate from '../../../database/models/Candidate.js'; // Your Candidate model
import QA from '../../../database/models/QA.js'; // Your QA model

export async function POST(request) {
    try {
        const body = await request.json();
        let { fullName, email, password, role, languages } = body;
        // console.log("Received signup data:", body);

        if (!fullName || !email || !password || !role || !languages || languages.length === 0) {
            return NextResponse.json(
                { message: 'All fields (fullName, email, password, role, languages) are required.' },
                { status: 400 }
            );
        }

        if (role !== CANDIDATE && role !== QUALITY_ASSURANCE) {
            return NextResponse.json(
                { message: `Invalid role. Only '${CANDIDATE}' and '${QUALITY_ASSURANCE}' are supported.` },
                { status: 400 }
            );
        }

        await DBConnect();

        const candidateExists = await Candidate.findOne({ email });
        const qaExists = await QA.findOne({ email });

        if (candidateExists || qaExists) {
            return NextResponse.json(
                { message: 'User with this email already exists.' },
                { status: 400 }
            );
        }

        let newUser;
        if (role === CANDIDATE) {
            newUser = new Candidate({
                fullName,
                email,
                password,
                role,
                languages,
            });
        } else if (role === QUALITY_ASSURANCE) {
            newUser = new QA({
                fullName,
                email,
                password,
                role,
                languages,
            });
        }

        await newUser.save();

        return NextResponse.json(
            { message: 'User created successfully.' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error in signup API:', error.message);
        return NextResponse.json(
            { message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}

export function GET() {
    return NextResponse.json({ message: 'Only POST requests allowed' }, { status: 405 });
}

