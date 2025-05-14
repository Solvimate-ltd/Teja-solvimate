import { NextResponse } from 'next/server';
import DBConnect from '@/app/database/lib/db';
import Candidate from '@/app/database/models/Candidate';
import Task from "@/app/database/models/Task";
import Sentence from "@/app/database/models/Sentence";
import getUserFromToken from '@/app/database/lib/auth';
import { CANDIDATE } from "@/app/database/constants/role";

export async function GET(request, { params }) {
  try {
    const { user, error } = await getUserFromToken(request);

    if (error) {
      const status = error === "No token found" ? 401 : 403;
      return NextResponse.json({ message: `Authentication failed: ${error}` }, { status });
    }

    if (user.role !== CANDIDATE) {
      return NextResponse.json(
        { message: `Access denied. Only users with the '${CANDIDATE}' role can access this resource.` },
        { status: 403 }
      );
    }

    const { taskId } = await params;
    await DBConnect();

    const task = await Task.findById(taskId)
      .populate("fromLanguage", "language")
      .populate("toLanguage", "language")
      .populate("sentences");

    if (!task) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    const untranslatedSentences = task.sentences.filter(sentence => !sentence.isTranslated);

    if (!untranslatedSentences || untranslatedSentences.length === 0) {
      return NextResponse.json({ message: "No Sentence to Translate" }, { status: 200 });
    }

    const formattedSentences = untranslatedSentences.map(sentence => ({
      _id: sentence._id,
      sentence: sentence.sentence
      // here QA message
    }));

    const formattedTask = {
      taskName: task.taskName,
      deadLine: task.deadLine,
      fromLanguage: task.fromLanguage?.language || "N/A",
      toLanguage: task.toLanguage?.language || "N/A",
      sentences: formattedSentences
    };

    return NextResponse.json(
      {
        message: "Task with sentences fetched successfully.",
        task: formattedTask
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in /api/employee/candidate/service/translation/:taskId GET:', error);
    return NextResponse.json(
      {
        message: 'An unexpected error occurred while fetching task data.',
        error: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { message: 'Method Not Allowed. Only GET requests are supported at this endpoint.' },
    { status: 405 }
  );
}

