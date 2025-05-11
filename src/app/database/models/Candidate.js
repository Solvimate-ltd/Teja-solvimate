import mongoose from 'mongoose';
import { CANDIDATE } from '../constants/role';
import Language from "./Language";
import Task from "./Task";


const candidateSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
        index: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: CANDIDATE,
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    languages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
        required: true,
    }],
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    }]
    // more property later on
});

const Candidate = mongoose.models[CANDIDATE] || mongoose.model(CANDIDATE, candidateSchema);

export default Candidate;
