import mongoose from 'mongoose';

const ReferralClaimSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }, // Amount in USD (matches referralWallet)
    amountInr: { type: Number, required: true }, // Amount in INR
    bankAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount', required: true },
    status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.ReferralClaim || mongoose.model('ReferralClaim', ReferralClaimSchema);
