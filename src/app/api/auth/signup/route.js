import { NextResponse } from 'next/server';
import { CANDIDATE, QUALITY_ASSURANCE } from '../../../constants/role.js';
import DBConnect from '../../../lib/db.js'; // Your database connection function
import Candidate from '../../../models/Candidate'; // Your Candidate model
import QA from '../../../models/QA'; // Your QA model

export async function POST(request) {
    try {
        const body = await request.json();
        let { fullName, email, password, role, languages } = body;

        if (!fullName || !email || !password || !role || !languages || languages.length === 0) {
            return NextResponse.json({ message: 'All basic fields (fullName, email, password, role, languages) are required' }, { status: 400 });
        }

        if (role !== CANDIDATE && role !== QUALITY_ASSURANCE) {
            return NextResponse.json({ message: `Invalid role. Only '${CANDIDATE}' and '${QUALITY_ASSURANCE}' are supported.` }, { status: 400 });
        }

        await DBConnect();

        const candidateExists = await Candidate.findOne({ email });
        const QAExists = await QA.findOne({ email });

        if (candidateExists || QAExists) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        // make sure all languages are in uppercase
        languages = languages.map(language => language.toUpperCase());
        let newUser;
        if (role === CANDIDATE) {
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
            },
            { status: 201 }
        );

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



