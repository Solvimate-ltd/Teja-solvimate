import { NextResponse } from 'next/server';
import DBConnect from '@/app/database/lib/db.js';
import Task from "@/app/database/models/Task";
import getUserFromToken from "@/app/database/lib/auth";
import { ADMIN, CANDIDATE, QUALITY_ASSURANCE } from "@/app/database/constants/role.js";

export async function GET(request) {
  try {
    const { user, error } = await getUserFromToken(request);

    if (error) {
      const status = error === 'No token found' ? 401 : 403;
      return NextResponse.json({ message: error }, { status });
    }
    

    await DBConnect();

    let tasks;

    if (user.role === ADMIN) {
      tasks = await Task.find({})
        .select("-sentences")
        .populate({ path: "qualityAssurance", select: "fullName" })
        .populate({ path: "candidate", select: "fullName" })
        .populate({ path: "fromLanguage", select: "language" })
        .populate({ path: "toLanguage", select: "language" });
    } 
    else if (user.role === CANDIDATE) {
      tasks = await Task.find({ candidate: user._id })
        .select("-sentences -candidate")
        .populate({ path: "qualityAssurance", select: "fullName" })
        .populate({ path: "fromLanguage", select: "language" })
        .populate({ path: "toLanguage", select: "language" });
    } 
    else if (user.role === QUALITY_ASSURANCE) {
      tasks = await Task.find({ qualityAssurance: user._id })
        .select("-sentences -qualityAssurance")
        .populate({ path: "candidate", select: "fullName" })
        .populate({ path: "fromLanguage", select: "language" })
        .populate({ path: "toLanguage", select: "language" });
    } 

    return NextResponse.json({ msg: "Tasks Fetched", tasks }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/employee/task GET:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

