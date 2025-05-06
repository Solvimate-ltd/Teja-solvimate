import mongoose from 'mongoose';
import { ADMIN } from '../constants/role';

const adminSchema = new mongoose.Schema({
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
        index: true // for better searching
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: ADMIN,
        required: true,
    },
    // Add more admin-specific properties here
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;