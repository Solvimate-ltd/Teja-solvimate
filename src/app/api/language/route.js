import { NextResponse } from 'next/server';
<<<<<<< HEAD
import dbConnect from '../../lib/db';
=======
//import dbConnect from '../../lib/db';
import DBConnect from '../../lib/db';
>>>>>>> master
import Language from "../../models/Language";

export async function GET(request) {
  try {

<<<<<<< HEAD
    await dbConnect();

    const languageDocuments = await Language.find({});
=======
    await DBConnect();

    const languageDocuments = await Language.find({});
    
>>>>>>> master

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
<<<<<<< HEAD
}
=======
}
>>>>>>> master
