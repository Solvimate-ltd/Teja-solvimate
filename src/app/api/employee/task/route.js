import { NextResponse } from 'next/server';
import { ADMIN } from '@/app/database/constants/role.js';
import DBConnect from '@/app/database/lib/db.js';
import Candidate from '@/app/database/models/Candidate.js';
import QA from '@/app/database/models/QA.js';
import getUserFromToken from "@/app/database/lib/auth";
import { isValidObjectId } from 'mongoose';

import Task from "@/app/database/models/Task";
import Sentence from "@/app/database/models/Sentence";
import { CANDIDATE, QUALITY_ASSURANCE } from "@/app/database/constants/role.js";



export async function GET(request) {
  const { user, error } = await getUserFromToken(request);

  if (error) {
    const status = error === 'No token found' ? 401 : 403;
    return NextResponse.json({ message: error }, { status });
  }

  if (user.role !== ADMIN) {
    return NextResponse.json(
      { message: `Access denied. Only '${ADMIN}' can assign tasks.` },
      { status: 403 }
    );
  }


  try {
    await DBConnect();
    const tasks = await Task.find({}).select("-sentences").populate({
      path: "qualityAssurance",
      select: "fullName"
    }).populate({
      path: "candidate",
      select: "fullName"
    }).populate({
      path: "fromLanguage",
      select: "language"
    }).populate({
      path: "toLanguage",
      select: "language"
    });

    return NextResponse.json({ msg: "Tasks Fetched", tasks }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/employee/task GET:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
