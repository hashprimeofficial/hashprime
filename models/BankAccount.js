import mongoose from 'mongoose';

const BankAccountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        accountHolderName: {
            type: String,
            required: true,
        },
        accountNumber: {
            type: String,
            required: true,
        },
        ifsc: {
            type: String,
            required: true,
        },
        bankName: {
            type: String,
            required: true,
        },
        branch: {
            type: String,
            required: true,
        },
        accountType: {
            type: String,
            required: true, // e.g., 'Savings', 'Current'
        },
    },
    { timestamps: true }
);

export default mongoose.models.BankAccount || mongoose.model('BankAccount', BankAccountSchema);
