import mongoose from 'mongoose';

const WithdrawalSchema = new mongoose.Schema(
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
            default: 'USDT', // Currently, withdrawals are only in USDT profits
        },
        walletAddress: {
            type: String, // BEP20 Wallet Address
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        adminNote: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

// Force clear the model from cache to apply schema changes in development
if (mongoose.models.Withdrawal) {
    delete mongoose.models.Withdrawal;
}

const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);
export default Withdrawal;
