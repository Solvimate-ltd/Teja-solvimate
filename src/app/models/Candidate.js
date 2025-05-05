import mongoose from 'mongoose';
import { CANDIDATE } from '../constants/role';

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
        match: [/.+@.+\..+/, 'Please enter a valid email address']
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
    languages: {
        type: [String],
        required: true,
    }
    // more property later on
});

const Candidate = mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);

export default Candidate;
