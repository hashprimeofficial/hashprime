import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        referredBy: {
            type: String,
            default: '',
        },
        usdtBalance: {
            type: Number,
            default: 0,
        },
        // Profile Fields
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        address: { type: String, default: '' },
        pincode: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        country: { type: String, default: '' },

        // KYC Fields
        panNumber: { type: String, default: '' },
        panDocumentUrl: { type: String, default: '' },
        aadhaarNumber: { type: String, default: '' },
        aadhaarDocumentUrl: { type: String, default: '' },
        occupation: { type: String, default: '' },
        sourceOfIncome: { type: String, default: '' },
        incomeRange: { type: String, default: '' },
        kycStatus: {
            type: String,
            enum: ['unsubmitted', 'pending', 'approved', 'rejected'],
            default: 'unsubmitted'
        },

        // Security / 2FA Fields
        twoFactorSecret: { type: String, default: '' },
        isTwoFactorEnabled: { type: Boolean, default: false },

        // Email OTP and Verification Fields
        isEmailVerified: { type: Boolean, default: false },
        otpCode: { type: String, default: null },
        otpExpiry: { type: Date, default: null },

        // Deposit & Referrals
        walletBalance: { type: Number, default: 0 },
        referralCode: { type: String, unique: true, sparse: true, default: null }
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
