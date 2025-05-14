import { NextResponse } from 'next/server';
import DBConnect from '@/app/database/lib/db';
import Sentence from '@/app/database/models/Sentence';
import Task from '@/app/database/models/Task';
import getUserFromToken from '@/app/database/lib/auth';
import { CANDIDATE } from "@/app/database/constants/role";

export async function PATCH(request) {
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

    const requestBody = await request.json();
    const { _id, translatedSentence } = requestBody;

    if (!_id || !translatedSentence || translatedSentence.trim().length === 0) {
      return NextResponse.json(
        { message: "Please provide a valid sentence ID and non-empty translated sentence." },
        { status: 400 }
      );
    }

    await DBConnect();

    const sentence = await Sentence.findById(_id);
    if (!sentence) {
      return NextResponse.json({ message: "Sentence not found." }, { status: 404 });
    }

    const wasTranslated = sentence.isTranslated;

    sentence.translatedSentence = translatedSentence.trim();
    sentence.isTranslated = true;
    await sentence.save();

    const taskId = sentence.belongsTo;
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    // Increment only if sentence was not previously translated
    if (!wasTranslated) {
      task.counters.translatedSentences += 1;
      await task.save();
    }

    return NextResponse.json(
      { message: "Sentence updated successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in /api/employee/candidate/service/translation PATCH:', error);
    return NextResponse.json(
      {
        message: 'An unexpected error occurred while updating the sentence.',
        error: error.message
      },
      { status: 500 }
    );
  }
}

