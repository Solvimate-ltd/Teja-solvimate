import { NextResponse } from 'next/server';
import DBConnect from '@/app/database/lib/db.js';
import Task from "@/app/database/models/Task";
import getUserFromToken from "@/app/database/lib/auth";
import { ADMIN, CANDIDATE, QUALITY_ASSURANCE } from "@/app/database/constants/role.js";
import Candidate from '@/app/database/models/Candidate.js';
import { isValidObjectId } from 'mongoose';
import Sentence from "@/app/database/models/Sentence";

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
    } else if (user.role === CANDIDATE) {
      tasks = await Task.find({ candidate: user._id })
        .select("-sentences -candidate")
        .populate({ path: "qualityAssurance", select: "fullName" })
        .populate({ path: "fromLanguage", select: "language" })
        .populate({ path: "toLanguage", select: "language" });
    } else if (user.role === QUALITY_ASSURANCE) {
      tasks = await Task.find({ qualityAssurance: user._id })
        .select("-sentences -qualityAssurance")
        .populate({ path: "candidate", select: "fullName" })
        .populate({ path: "fromLanguage", select: "language" })
        .populate({ path: "toLanguage", select: "language" });
    }

    return NextResponse.json({ msg: "Tasks fetched", tasks }, { status: 200 });
  } catch (error) {
    console.error('Error in /api/employee/task GET:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const body = await request.json();
    const {
      taskName,
      deadlineDate: deadLine,
      fromLanguage,
      toLanguage,
      mode,
      qualityAssurance,
      candidate,
      sentences
    } = body;

    if (!taskName || typeof taskName !== 'string' || !deadLine || typeof deadLine !== 'string') {
      return NextResponse.json({ message: 'taskName and deadlineDate are required and must be strings.' }, { status: 400 });
    }

    if (
      !isValidObjectId(fromLanguage) ||
      !isValidObjectId(toLanguage) ||
      !isValidObjectId(qualityAssurance) ||
      (candidate && !isValidObjectId(candidate))
    ) {
      return NextResponse.json({ message: 'Invalid ObjectId in one of the fields.' }, { status: 400 });
    }

    if (!Array.isArray(sentences) || sentences.length === 0 || !sentences.every(s => typeof s === 'string')) {
      return NextResponse.json({ message: 'Sentences must be a non-empty array of strings.' }, { status: 400 });
    }

    const modeValue = mode?.toUpperCase();
    if (!['PUBLIC', 'ASSIGNED'].includes(modeValue)) {
      return NextResponse.json({ message: "Mode must be either 'public' or 'assigned'." }, { status: 400 });
    }

    const task = new Task({
      taskName,
      deadLine,
      fromLanguage,
      toLanguage,
      mode: modeValue,
      qualityAssurance,
      candidate: candidate ?? null,
    });

    await task.save(); // to get _id

    const sentenceDocuments = sentences.map(sentence => new Sentence({ sentence, belongsTo: task._id }));
    await Sentence.insertMany(sentenceDocuments);
    const sentenceIds = sentenceDocuments.map(doc => doc._id);

    task.counters.totalSentences = sentenceIds.length;
    task.sentences = sentenceIds;
    await task.save(); // now with sentences

    if (candidate) {
      try {
        const candidateDoc = await Candidate.findById(candidate);
        if (!candidateDoc) throw new Error("Candidate not found");

        candidateDoc.tasks.push(task._id);
        await candidateDoc.save();
      } catch (error) {
        try
        {
          await Sentence.deleteMany({ _id: { $in: sentenceIds}});
          await Task.findByIdAndDelete(task._id);
        }
        catch(cleanupError)
        {
          console.error("Cleanup failed after task creation error:", cleanupError);
        }
        throw error;
      }
    }

    await task.populate("qualityAssurance");
    await task.populate("candidate");
    await task.populate("sentences");

    return NextResponse.json({ msg: "Task assigned successfully" }, { status: 201 });
  } catch (error) {
    console.error('Error in /api/employee/service/translation POST:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

