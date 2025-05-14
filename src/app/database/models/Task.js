import mongoose from 'mongoose';
import QA from "./QA";
import Language from './Language';
import Candidate from "./Candidate";
import Sentence from './Sentence';
import { UNDER_CANDIDATE_PROGESS, UNDER_QA_PROGRESS, COMPLETED } from "../constants/constants";

import { CANDIDATE, QUALITY_ASSURANCE } from "../constants/role";


const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
    trim: true
  },
  deadLine: {
    type: Date,
    required: true
  },
  fromLanguage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  toLanguage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language',
    required: true
  },
  mode: {
    type: String,
    enum: ["PUBLIC", "ASSIGNED"],
    required: true,
    uppercase: true
  },
  status: {
    type: String,
    enum: [UNDER_CANDIDATE_PROGESS, UNDER_QA_PROGRESS, COMPLETED],
    required: true,
    uppercase: true,
    default: UNDER_CANDIDATE_PROGESS
  },
  qualityAssurance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: QUALITY_ASSURANCE,
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: CANDIDATE,
  },
  sentences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sentence'
  }],
  counters: {
    totalSentences: {
      type: Number,
      default: 0
    },
    translatedSentences: {
      type: Number,
      default: 0
    },
    reviewedSentences: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true  
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
