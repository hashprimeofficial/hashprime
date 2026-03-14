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
        sourceWallet: {
            type: String,
            enum: ['USD', 'INR', 'Referral'],
            required: true,
        },
        payoutMethod: {
            type: String,
            enum: ['USDT', 'Bank'],
            required: true,
        },
        walletAddress: {
            type: String, // BEP20 Wallet Address or bank summary string
            required: true,
        },
        bankAccountId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BankAccount',
            default: null,
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
