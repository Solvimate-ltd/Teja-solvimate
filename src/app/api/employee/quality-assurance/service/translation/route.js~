import { NextResponse } from 'next/server';
import DBConnect from '@/app/database/lib/db';
import Sentence from '@/app/database/models/Sentence';
import Task from '@/app/database/models/Task';
import getUserFromToken from '@/app/database/lib/auth';
import { QUALITY_ASSURANCE } from "@/app/database/constants/role";
import { UNDER_CANDIDATE, COMPLETED } from "@/app/database/constants/constants";

export async function PATCH(request) {
  try {
    const { user, error } = await getUserFromToken(request);

    if (error) {
      const status = error === "No token found" ? 401 : 403;
      return NextResponse.json({ message: `Authentication failed: ${error}` }, { status });
    }

    if (user.role !== QUALITY_ASSURANCE) {
      return NextResponse.json(
        { message: `Access denied. Only users with the '${QUALITY_ASSURANCE}' role can access this resource.` },
        { status: 403 }
      );
    }

    const requestBody = await request.json();
    const { taskId, verifiedSentences, reworkedSentences, deletedSentences } = requestBody;

    if (!verifiedSentences || !reworkedSentences || !deletedSentences) {
      return NextResponse.json(
        { message: "Please provide verifiedSentences, reworkedSentences, and deletedSentences." },
        { status: 400 }
      );
    }

    await DBConnect();

    const verifiedUpdates = verifiedSentences.map(id =>
      Sentence.findByIdAndUpdate(id, { isReviewed: true })
    );
    await Promise.all(verifiedUpdates);

    const deletedUpdates = deletedSentences.map(id =>
      Sentence.findByIdAndUpdate(id, { isAbusive: true, isTranslated: true, isReviewed: true })
    );
    await Promise.all(deletedUpdates);

    

    for (const reworkSentence of reworkedSentences) {
      if (!reworkSentence._id) continue;

      const sentence = await Sentence.findById(reworkSentence._id);
      if (!sentence) continue;

      sentence.isTranslated = false;
      sentence.review = {
        submittedSentence: sentence.translatedSentence,
        remark: reworkSentence.remark,
      };
      sentence.translatedSentence = "";
      await sentence.save();
    }

    if (taskId) {
      const task = await Task.findById(taskId);
      if (task) {
        if (verifiedSentences.length > 0) {
          task.counters.reviewedSentences += verifiedSentences.length;
        }
        if (reworkedSentences.length > 0) {
          task.counters.translatedSentences -= reworkedSentences.length;
          task.status = UNDER_CANDIDATE;
        }

        if( deletedSentences.length > 0)
        {    
          task.counters.reviewedSentences += deletedSentences.length;      
        }

        


        if(  task.counters.totalSentences === task.counters.translatedSentences &&  task.counters.translatedSentences === task.counters.reviewedSentences)
        {
          task.status = COMPLETED;
        }
        await task.save();
      }
    }

    return NextResponse.json(
      { message: "Review process completed successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in PATCH /api/employee/quality-assurance/service/translation:', error);
    return NextResponse.json(
      {
        message: 'An unexpected error occurred while updating the sentences.',
        error: error.message
      },
      { status: 500 }
    );
  }
}

