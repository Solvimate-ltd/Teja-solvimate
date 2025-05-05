import mongoose from 'mongoose';
import { QUALITY_ASSURANCE } from '../constants/role';

const qaSchema = new mongoose.Schema({
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
        default: QUALITY_ASSURANCE,
        required: true,
    },
});

const QA = mongoose.models['Quality-Assurance'] || mongoose.model("Quality-Assurance", qaSchema);

export default QA;
