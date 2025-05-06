import { NextResponse } from 'next/server';
import DBConnect from '../../database/lib/db';
import Language from "../../database/models/Language";
import getToken from "../../database/lib/auth";
import { ADMIN } from '@/app/database/constants/role';


export async function GET(request) {
  try {

    await DBConnect();

    const languageDocuments = await Language.find({});

    const response = NextResponse.json({
      message: 'Languages fetched',
      languages: languageDocuments
    });

    return response;

  } catch (error) {
    console.error('Language API handler error:', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { user, error } = await getToken(request);

  if (error) {
    const status = error === 'No token found' ? 401 : 403;
    return NextResponse.json({ message: error }, { status });
  }

  // console.log("In Adding language APIs", user.role);

  if (user.role !== ADMIN) {
    return NextResponse.json(
      { message: `Access denied. Only '${ADMIN}' can add languages.` },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    let { language } = body;

    if (!language || language.trim().length === 0) {
      return NextResponse.json({ message: 'Language is required' }, { status: 400 });
    }

    language = language.trim().toUpperCase();

    await DBConnect();

    const languageExists = await Language.findOne({ language });

    if (languageExists) {
      return NextResponse.json({ message: 'Language already exists' }, { status: 409 });
    }

    const languageDocument = new Language({ language });
    await languageDocument.save();

    return NextResponse.json(
      { message: 'Language created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in Language POST API:', error.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
