import mongoose from 'mongoose';

const DepositSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'usdt', 'bank'],
            required: true,
        },
        screenshotUrl: {
            type: String,
            required: true, // we mandate a screenshot for verification
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        adminNote: {
            type: String,
            default: '',
        }
    },
    { timestamps: true }
);

export default mongoose.models.Deposit || mongoose.model('Deposit', DepositSchema);
