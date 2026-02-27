import mongoose from 'mongoose';

const InvestmentSchema = new mongoose.Schema(
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
        schemeType: {
            type: String,
            enum: ['3m', '6m', '1y', '5y'],
            required: true,
        },
        usdtReward: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'active', 'completed'],
            default: 'pending',
        },
        maturesAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Investment || mongoose.model('Investment', InvestmentSchema);
