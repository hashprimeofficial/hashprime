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
        currency: {
            type: String,
            enum: ['USD', 'INR'],
            required: true,
            default: 'INR'
        },
        schemeType: {
            type: String,
            enum: ['3m_inr', '6m_inr', '1y_inr', '5y_inr', '3m_usd', '6m_usd', '1y_usd', '5y_usd'],
            required: true,
        },
        usdtReward: {
            type: Number,
            required: false,
        },
        inrReward: {
            type: Number,
            required: false,
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
