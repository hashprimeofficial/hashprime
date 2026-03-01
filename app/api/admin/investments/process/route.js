import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Investment from '@/models/Investment';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        // Find all active investments that have passed their maturity date
        const maturedInvestments = await Investment.find({
            status: 'active',
            maturesAt: { $lte: new Date() }
        });

        if (maturedInvestments.length === 0) {
            return NextResponse.json({ message: 'No matured investments found', count: 0 }, { status: 200 });
        }

        let processedCount = 0;

        // Process each matured investment
        for (const investment of maturedInvestments) {
            const reward = investment.usdtReward;

            // 1. Update investment status to completed
            await Investment.findByIdAndUpdate(investment._id, { status: 'completed' });

            // 2. Credit the User's USDT Balance
            await User.findByIdAndUpdate(investment.userId, {
                $inc: { usdtBalance: reward }
            });

            // 3. Create a Transaction Record
            await Transaction.create({
                userId: investment.userId,
                type: 'investment',
                amount: reward,
                currency: 'USDT',
                description: `Investment matured automatically. Credited ${reward} USDT to Trading Balance.`,
            });

            processedCount++;
        }

        return NextResponse.json({
            message: `Successfully processed ${processedCount} matured investments`,
            count: processedCount
        }, { status: 200 });

    } catch (error) {
        console.error('Process Matured Investments Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
