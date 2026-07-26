const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const mongoUri = envContent.match(/MONGODB_URI=(.*)/)[1].trim().replace(/^['\"]|['\"]$/g, '');

async function run() {
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    const User = mongoose.connection.db.collection('users');
    const Investment = mongoose.connection.db.collection('investments');
    const Transaction = mongoose.connection.db.collection('transactions');

    const kup = await User.findOne({ name: /kuppusamy/i });
    if (!kup) {
        console.error('Kuppusamy user not found!');
        process.exit(1);
    }
    console.log('Found Kuppusamy user:', kup._id, kup.name, kup.email);

    // 1. Remove the erroneous 20,000 transaction (ID 6a62fd62a7ffbf56160384b9)
    const errTx = await Transaction.findOne({ _id: new mongoose.Types.ObjectId('6a62fd62a7ffbf56160384b9') });
    if (errTx) {
        await Transaction.deleteOne({ _id: errTx._id });
        console.log('Deleted erroneous 20,000 transaction 6a62fd62a7ffbf56160384b9');
    } else {
        console.log('Erroneous 20,000 transaction not found or already deleted');
    }

    // 2. Set limitedRateOverride = 0.05 (5%) and inrWallet = 0 for Kuppusamy
    await User.updateOne(
        { _id: kup._id },
        { 
            $set: { 
                inrWallet: 0, 
                limitedRateOverride: 0.05 
            } 
        }
    );
    console.log('Updated Kuppusamy user: inrWallet = 0, limitedRateOverride = 0.05');

    // 3. Update active investment paidMonths = [1]
    const inv = await Investment.findOne({ userId: kup._id, schemeType: 'limited_inr' });
    if (inv) {
        await Investment.updateOne(
            { _id: inv._id },
            { $set: { paidMonths: [1] } }
        );
        console.log('Updated Kuppusamy investment paidMonths = [1]');
    }

    // 4. Create/Ensure completed withdrawal transaction of 25,000 for July
    const julyWithdrawalTx = await Transaction.findOne({
        userId: kup._id,
        type: 'withdrawal',
        amount: -25000
    });

    if (!julyWithdrawalTx) {
        await Transaction.insertOne({
            userId: kup._id,
            type: 'withdrawal',
            amount: -25000,
            currency: 'INR',
            description: 'Monthly payout withdrawal of ₹25,000 (July 5% return on 5L limited scheme) collected',
            createdAt: new Date('2026-07-01T10:00:00.000Z'),
            updatedAt: new Date('2026-07-01T10:00:00.000Z'),
            __v: 0
        });
        console.log('Inserted July withdrawal transaction of ₹25,000 for Kuppusamy');
    } else {
        console.log('July withdrawal transaction already exists');
    }

    console.log('Database corrections complete for Kuppusamy Chinnan!');
    await mongoose.disconnect();
}

run().catch(console.error);
