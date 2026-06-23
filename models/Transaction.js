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
            enum: ['investment', 'referral_bonus', 'withdrawal', 'deposit'],
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

// Force clear the model from cache to apply schema changes in development
if (mongoose.models.Transaction) {
    delete mongoose.models.Transaction;
}

const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;
