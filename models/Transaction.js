import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['investment', 'referral_bonus', 'withdrawal'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ['INR', 'USDT'],
            required: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
