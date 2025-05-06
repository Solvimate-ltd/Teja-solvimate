import { NextResponse } from 'next/server';
//import dbConnect from '../../lib/db';
import DBConnect from '../../lib/db';
import Language from "../../models/Language";

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


export function POST() {
  return NextResponse.json({ message: 'Only GET requests allowed' }, { status: 405 });
}