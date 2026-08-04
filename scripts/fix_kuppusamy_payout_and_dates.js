const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Read MongoDB URI from .env.local
let mongoUri = null;
try {
    const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
    for (const line of envContent.split('\n')) {
        if (line.startsWith('MONGODB_URI=')) {
            mongoUri = line.substring('MONGODB_URI='.length).trim().replace(/^['"]+|['"]+$/g, '');
            break;
        }
    }
} catch (e) {
    console.error('Failed to read .env.local:', e);
    process.exit(1);
}

if (!mongoUri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
}

async function run() {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to DB');

    const User       = mongoose.connection.db.collection('users');
    const Investment = mongoose.connection.db.collection('investments');
    const Transaction = mongoose.connection.db.collection('transactions');

    // ── 1. Find Kuppusamy Chinnan ────────────────────────────────────────────────
    const kup = await User.findOne({ email: 's.hanthikuppusamy1966@gmail.com' });
    if (!kup) {
        console.error('❌ Kuppusamy user not found!');
        process.exit(1);
    }
    console.log(`Found user: ${kup.name} (${kup.email}) — inrWallet: ₹${kup.inrWallet}`);

    // ── 2. Fix investmentDate & maturesAt ───────────────────────────────────────
    const INVEST_DATE  = new Date('2026-06-01T00:00:00.000Z');
    const MATURES_DATE = new Date('2026-12-01T00:00:00.000Z');

    const inv = await Investment.findOne({ userId: kup._id, schemeType: 'limited_inr', status: 'active' });
    if (!inv) {
        console.error('❌ Kuppusamy active limited_inr investment not found!');
        process.exit(1);
    }
    console.log(`Found investment: ${inv._id} | investmentDate: ${inv.investmentDate} | maturesAt: ${inv.maturesAt}`);

    await Investment.updateOne(
        { _id: inv._id },
        { $set: { investmentDate: INVEST_DATE, maturesAt: MATURES_DATE } }
    );
    console.log(`✅ Updated investmentDate → 2026-06-01 | maturesAt → 2026-12-01`);

    // ── 3. Ensure July 1st payout (First month returns, +₹25,000) exists ────────
    const julyPayout = await Transaction.findOne({
        userId: kup._id,
        type: 'investment',
        description: 'First month returns'
    });

    if (!julyPayout) {
        await Transaction.insertOne({
            userId: kup._id,
            type: 'investment',
            amount: 25000,
            currency: 'INR',
            description: 'First month returns',
            createdAt: new Date('2026-07-01T10:00:00.000Z'),
            updatedAt: new Date('2026-07-01T10:00:00.000Z'),
            __v: 0
        });
        console.log('✅ Inserted First month returns payout (₹25,000 on 2026-07-01)');
    } else {
        console.log('⏭ First month returns payout already exists — skipping');
    }

    // ── 4. Ensure investment paidMonths includes both [1, 2] ────────────────────
    const freshInv = await Investment.findOne({ _id: inv._id });
    const paidMonths = freshInv.paidMonths || [];
    const toAdd = [1, 2].filter(m => !paidMonths.includes(m));
    if (toAdd.length > 0) {
        await Investment.updateOne({ _id: inv._id }, { $push: { paidMonths: { $each: toAdd } } });
        console.log(`✅ Added paidMonths: [${toAdd.join(', ')}]`);
    } else {
        console.log('⏭ paidMonths [1, 2] already marked — skipping');
    }

    // ── 5. Reconcile INR Wallet ──────────────────────────────────────────────────
    // Ledger:
    //   +500,000  deposit (June 01)
    //   -500,000  investment (June 01)
    //    +25,000  referral_bonus (July 10)
    //    -25,000  withdrawal (July 01 — cash collected)
    //    +25,000  First month returns (July 01)
    //    +25,000  Second month returns (August 01)
    // ──────────────────────────────────────────────────────────
    // Balance = 0 + 25,000 - 25,000 + 25,000 + 25,000 = 50,000
    // BUT: referral_bonus goes to referralWalletInr (separate), so exclude.
    // And the July withdrawal (-25,000) was a cash collection (withdrawal tx).
    // So INR wallet =  +25,000 (July payout) + 25,000 (Aug payout) - 25,000 (withdrawal) = 25,000
    const expectedInrWallet = 25000;
    await User.updateOne({ _id: kup._id }, { $set: { inrWallet: expectedInrWallet } });
    console.log(`✅ Set inrWallet → ₹${expectedInrWallet}`);

    const updatedUser = await User.findOne({ _id: kup._id });
    console.log(`\n📊 Final State:`);
    console.log(`   inrWallet: ₹${updatedUser.inrWallet}`);
    const updatedInv = await Investment.findOne({ _id: inv._id });
    console.log(`   investmentDate: ${updatedInv.investmentDate}`);
    console.log(`   maturesAt: ${updatedInv.maturesAt}`);
    console.log(`   paidMonths: [${updatedInv.paidMonths.join(', ')}]`);

    await mongoose.disconnect();
    console.log('\n✅ Database corrections complete for Kuppusamy Chinnan!');
}

run().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
