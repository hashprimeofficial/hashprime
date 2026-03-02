import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import Deposit from '@/models/Deposit';
import Withdrawal from '@/models/Withdrawal';
import { getExchangeRate } from '@/lib/exchangeRate';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectToDatabase();

        // Total users excluding admins
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Total capital in INR (Active & Completed Investments)
        const investments = await Investment.find({ status: { $in: ['active', 'completed'] } });
        const totalCapitalLocked = investments.reduce((acc, inv) => acc + inv.amount, 0);

        // Total Platform Liability (Sum of all user usdtBalances)
        const allUsers = await User.find({ role: 'user' }, 'usdtBalance');
        const totalUsdtLiability = allUsers.reduce((acc, user) => acc + (user.usdtBalance || 0), 0);

        // Total Withdrawals Paid
        const paidWithdrawals = await Withdrawal.find({ status: 'approved' });
        const totalWithdrawalsPaid = paidWithdrawals.reduce((acc, w) => acc + w.amount, 0);

        // Total Fiat Deposited (Approved) — INR direct + USDT converted to INR
        const approvedDeposits = await Deposit.find({ status: 'approved' });
        const usdtRate = await getExchangeRate(); // INR per USDT, e.g. 85
        const totalDepositsINR = approvedDeposits.reduce((acc, d) => {
            if (d.paymentMethod === 'usdt') {
                // USDT deposit: convert amount (USD) to INR
                return acc + (d.amount || 0) * usdtRate;
            }
            // INR deposit (bank transfer): use directly
            return acc + (d.amount || 0);
        }, 0);

        // Recent 5 investments with user details
        const recentInvestments = await Investment.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email');

        // Top 5 Investors (by total invested capital)
        const topInvestorsData = await Investment.aggregate([
            { $match: { status: { $in: ['active', 'completed'] } } },
            { $group: { _id: '$userId', totalInvested: { $sum: '$amount' } } },
            { $sort: { totalInvested: -1 } },
            { $limit: 5 }
        ]);

        const populatedTopInvestors = await User.populate(topInvestorsData, { path: '_id', select: 'name email avatar' });
        const topInvestors = populatedTopInvestors.map(inv => ({
            user: inv._id,
            totalInvested: inv.totalInvested
        })).filter(inv => inv.user); // Remove if user was deleted

        // Top 5 Referrals (by count of referred users)
        const topReferralsData = await User.aggregate([
            { $match: { referredBy: { $ne: null, $ne: '' } } },
            { $group: { _id: '$referredBy', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Resolve referredBy codes to actual users
        const topReferrals = await Promise.all(topReferralsData.map(async (ref) => {
            let referrer = await User.findOne({ referralCode: ref._id }).select('name email');
            if (!referrer && ref._id.length === 24) { // Fallback if referredBy is an ObjectId string in some old records
                try { referrer = await User.findById(ref._id).select('name email'); } catch (e) { }
            }
            return {
                referrerCode: ref._id,
                user: referrer,
                count: ref.count
            };
        }));

        return NextResponse.json({
            totalUsers,
            totalCapitalLocked,
            totalUsdtLiability,
            totalWithdrawalsPaid,
            totalDepositsINR,
            usdtRate,
            recentInvestments,
            topInvestors,
            topReferrals
        }, { status: 200 });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
