const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse MONGODB_URI from .env.local
let mongoUri = null;
try {
    const envPath = path.join(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            if (line.startsWith('MONGODB_URI=')) {
                mongoUri = line.substring('MONGODB_URI='.length).trim();
                if (mongoUri.startsWith('"') && mongoUri.endsWith('"')) mongoUri = mongoUri.slice(1, -1);
                else if (mongoUri.startsWith("'") && mongoUri.endsWith("'")) mongoUri = mongoUri.slice(1, -1);
                break;
            }
        }
    }
} catch (e) {
    console.error('Failed to read .env.local file:', e);
}

if (!mongoUri) {
    console.error('MONGODB_URI is not set in .env.local');
    process.exit(1);
}

// Inline schemas
const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    inrWallet: { type: Number, default: 0 },
    usdWallet: { type: Number, default: 0 },
    referralWallet: { type: Number, default: 0 },
    referralWalletInr: { type: Number, default: 0 }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const TransactionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    type: String,
    amount: Number,
    currency: String,
    description: String
}, { timestamps: true });
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

async function main() {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const users = await User.find();
    for (const user of users) {
        console.log(`Processing User: ${user.name} (${user.email})`);
        const txs = await Transaction.find({ userId: user._id });

        // Calculate expected wallet values based on ledger history
        let expectedInrWallet = 0;
        let expectedUsdWallet = 0;
        let expectedReferralInr = 0;
        let expectedReferralUsd = 0;

        // Trace transactions
        for (const tx of txs) {
            const amt = tx.amount;
            const currency = tx.currency || 'INR';

            if (tx.type === 'deposit' || tx.type === 'withdrawal' || tx.type === 'investment') {
                // Affects main wallets
                if (currency === 'INR') {
                    expectedInrWallet += amt;
                } else {
                    expectedUsdWallet += amt;
                }
            } else if (tx.type === 'referral_bonus') {
                // Affects referral wallets
                if (currency === 'INR') {
                    expectedReferralInr += amt;
                } else {
                    expectedReferralUsd += amt;
                }
            } else if (tx.type === 'payout') {
                // Decrements referral wallets (referral claim approved)
                // Note: the claim itself decrements the referral wallet, so we don't need to double-deduct
                // unless the ledger includes it as a separate transaction.
                // Let's check: does the claim endpoint create a payout transaction?
                // Yes, with payoutAmount (positive). But wait! The claim POST decrements the wallet immediately.
                // So the transaction of type 'payout' is just a log, and doesn't decrement/increment again.
            }
        }

        // Clamp to 0 to prevent negative floating point artifacts
        if (expectedInrWallet < 0) expectedInrWallet = 0;
        if (expectedUsdWallet < 0) expectedUsdWallet = 0;
        if (expectedReferralInr < 0) expectedReferralInr = 0;
        if (expectedReferralUsd < 0) expectedReferralUsd = 0;

        // Check if there is a mismatch
        let needsUpdate = false;
        const updates = {};

        if (user.inrWallet !== expectedInrWallet) {
            console.log(`  [INR Wallet Mismatch] DB: ₹${user.inrWallet} -> Expected: ₹${expectedInrWallet}`);
            updates.inrWallet = expectedInrWallet;
            needsUpdate = true;
        }
        if (user.usdWallet !== expectedUsdWallet) {
            console.log(`  [USD Wallet Mismatch] DB: $${user.usdWallet} -> Expected: $${expectedUsdWallet}`);
            updates.usdWallet = expectedUsdWallet;
            needsUpdate = true;
        }
        
        // Check referral wallets
        if (user.referralWalletInr !== expectedReferralInr) {
            // Note: Since Kuppusamy Chinnan has a pending claim of 5,000, their referralWalletInr is 0.
            // But expectedReferralInr based on transactions (referral_bonus) is 5000.
            // Let's check if there are pending/approved claims that justify this decrement.
            const claims = await mongoose.connection.db.collection('referralclaims').find({ userId: user._id }).toArray();
            const claimedInr = claims.reduce((sum, c) => sum + (c.currency === 'INR' ? c.amountInr : 0), 0);
            const correctedReferralInr = Math.max(0, expectedReferralInr - claimedInr);

            if (user.referralWalletInr !== correctedReferralInr) {
                console.log(`  [Referral INR Mismatch] DB: ₹${user.referralWalletInr} -> Corrected: ₹${correctedReferralInr}`);
                updates.referralWalletInr = correctedReferralInr;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            console.log(`  Updating user ${user.email} with corrections:`, updates);
            await User.findByIdAndUpdate(user._id, updates);
        } else {
            console.log(`  User wallet balances are consistent.`);
        }
    }

    console.log('Cleanup and correction complete.');
    await mongoose.disconnect();
}

main().catch(console.error);
