import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    position: {
        type: String,
        required: true,
        trim: true,
    },
    experience: {
        type: String,
        trim: true,
    },
    linkedIn: {
        type: String,
        trim: true,
    },
    coverLetter: {
        type: String,
        trim: true,
    },
    resumeUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['new', 'reviewed', 'shortlisted', 'rejected'],
        default: 'new',
    },
}, { timestamps: true });

export default mongoose.models.JobApplication || mongoose.model('JobApplication', JobApplicationSchema);
