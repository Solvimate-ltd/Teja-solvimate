import { NextResponse } from 'next/server';
import DBConnect from '@/app/database/lib/db';
import QA from '@/app/database/models/QA';
import getUserFromToken from '@/app/database/lib/auth';
import { ADMIN } from "@/app/database/constants/role";


export async function GET(request) {
  const { user, error } = await getUserFromToken(request);

  if (error) {
    const status = error === "No token found" ? 401 : 403;
    return NextResponse.json({ message: error }, { status });
  }

  if (user.role !== ADMIN) {
    return NextResponse.json(
      { message: `Access denied. Only '${ADMIN}' can see all Q/A List.` },
      { status: 403 }
    );
  }

  try {

    await DBConnect();

    const quality_assurances = await QA.find({}).populate('languages');

    return NextResponse.json(
      { message: `List of quality_assurances`, quality_assurances },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in /api/quality-assurances GET API:', error.message);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return NextResponse.json({ message: 'Only GET requests allowed now' }, { status: 405 });
}
