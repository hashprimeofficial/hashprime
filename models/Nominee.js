import mongoose from 'mongoose';

const NomineeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // One nominee per user for now
        },
        fullName: {
            type: String,
            required: true,
        },
        dob: {
            type: String,
            required: true,
        },
        relationship: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Nominee || mongoose.model('Nominee', NomineeSchema);
