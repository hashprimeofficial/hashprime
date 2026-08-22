import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { calculateReferralCommission } from '../lib/referralUtils.js';

/**
 * In-memory Mock Store simulating MongoDB atomic document transitions
 */
class MockDatabase {
    constructor() {
        this.users = new Map();
        this.investments = new Map();
        this.transactions = [];
    }

    reset() {
        this.users.clear();
        this.investments.clear();
        this.transactions = [];
    }

    createUser(user) {
        const id = user._id || `user_${this.users.size + 1}`;
        const record = {
            _id: id,
            name: user.name,
            email: user.email,
            referredBy: user.referredBy || null,
            referralCode: user.referralCode || `REF_${id}`,
            inrWallet: user.inrWallet || 0,
            usdWallet: user.usdWallet || 0,
            referralWalletInr: user.referralWalletInr || 0,
            referralWallet: user.referralWallet || 0,
            limitedRateOverride: user.limitedRateOverride || null
        };
        this.users.set(id, record);
        return record;
    }

    createInvestment(inv) {
        const id = inv._id || `inv_${this.investments.size + 1}`;
        const record = {
            _id: id,
            userId: inv.userId,
            amount: inv.amount,
            currency: inv.currency || 'INR',
            schemeType: inv.schemeType || 'limited_inr',
            status: inv.status || 'pending',
            paidMonths: Array.isArray(inv.paidMonths) ? [...inv.paidMonths] : [],
            directReferralPaid: inv.directReferralPaid || false,
            createdAt: inv.createdAt || new Date(),
            maturesAt: inv.maturesAt || new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        };
        this.investments.set(id, record);
        return record;
    }

    /**
     * Simulates Investment.findOneAndUpdate({ _id, status: 'pending' }, { status: 'active', directReferralPaid: true })
     */
    atomicActivateInvestment(investmentId) {
        const inv = this.investments.get(investmentId);
        if (!inv || inv.status !== 'pending' || inv.directReferralPaid) {
            return null; // Atomic transition condition failed
        }

        inv.status = 'active';
        inv.directReferralPaid = true;
        return { ...inv };
    }

    /**
     * Simulates Investment.findOneAndUpdate({ _id, status: 'active', paidMonths: { $ne: m } }, { $push: { paidMonths: m } })
     */
    atomicAddPaidMonth(investmentId, monthNumber) {
        const inv = this.investments.get(investmentId);
        if (!inv || inv.status !== 'active') {
            return null;
        }
        if (inv.paidMonths.includes(monthNumber)) {
            return null; // Condition paidMonths: { $ne: monthNumber } failed
        }

        inv.paidMonths.push(monthNumber);
        return { ...inv, paidMonths: [...inv.paidMonths] };
    }

    addTransaction(tx) {
        const record = {
            _id: `tx_${this.transactions.length + 1}`,
            userId: tx.userId,
            type: tx.type,
            amount: tx.amount,
            currency: tx.currency,
            description: tx.description,
            createdAt: new Date()
        };
        this.transactions.push(record);
        return record;
    }

    /**
     * Implementation of L1 Activation Workflow matching admin approval
     */
    processInvestmentActivation(investmentId) {
        const transitioned = this.atomicActivateInvestment(investmentId);
        if (!transitioned) {
            return { success: false, reason: 'Investment is not in pending status or already activated' };
        }

        const investor = this.users.get(transitioned.userId);
        if (!investor) return { success: false, reason: 'Investor not found' };

        // Process referral bonus if referrer exists
        if (investor.referredBy) {
            const referrer = Array.from(this.users.values()).find(
                u => u.email === investor.referredBy || u.referralCode === investor.referredBy
            );

            if (referrer) {
                const commissionRate = referrer.limitedRateOverride || 0.05;
                const commissionAmount = referrer.limitedRateOverride
                    ? Math.round(transitioned.amount * commissionRate)
                    : calculateReferralCommission(transitioned.amount);

                const isUsd = transitioned.currency === 'USD';
                if (isUsd) {
                    referrer.referralWallet += commissionAmount;
                } else {
                    referrer.referralWalletInr += commissionAmount;
                }

                this.addTransaction({
                    userId: referrer._id,
                    type: 'referral_bonus',
                    amount: commissionAmount,
                    currency: transitioned.currency,
                    description: `Direct Referral Bonus — ${investor.name}`
                });
            }
        }

        return { success: true, investment: transitioned };
    }

    /**
     * Implementation of L2 Cron Monthly Payout Workflow matching lib/cron.js
     */
    processMonthlyInterestPayoutForMonth(investmentId, monthNumber) {
        const inv = this.investments.get(investmentId);
        if (!inv || inv.status !== 'active' || inv.schemeType !== 'limited_inr') {
            return { success: false, reason: 'Not an active limited_inr investment' };
        }

        const transitioned = this.atomicAddPaidMonth(investmentId, monthNumber);
        if (!transitioned) {
            return { success: false, reason: `Month ${monthNumber} already paid or lock failed` };
        }

        const investor = this.users.get(inv.userId);
        if (!investor) return { success: false, reason: 'Investor not found' };

        const investorRate = investor.limitedRateOverride || 0.04;
        const monthlyYield = Math.round(inv.amount * investorRate);

        // 1. Credit investor
        investor.inrWallet += monthlyYield;
        this.addTransaction({
            userId: investor._id,
            type: 'investment',
            amount: monthlyYield,
            currency: 'INR',
            description: `Month ${monthNumber} returns`
        });

        // 2. Credit referrer monthly residual
        if (investor.referredBy) {
            const referrer = Array.from(this.users.values()).find(
                u => u.email === investor.referredBy || u.referralCode === investor.referredBy
            );

            if (referrer) {
                const residualCommission = calculateReferralCommission(monthlyYield);
                referrer.referralWalletInr += residualCommission;

                this.addTransaction({
                    userId: referrer._id,
                    type: 'referral_bonus',
                    amount: residualCommission,
                    currency: 'INR',
                    description: `Monthly Referral Commission — ${investor.name} Month ${monthNumber}`
                });
            }
        }

        return { success: true, monthNumber, monthlyYield };
    }
}

describe('Tier 2 & 3: Referral System Idempotency & Concurrency', () => {
    let db;

    beforeEach(() => {
        db = new MockDatabase();
    });

    describe('Tier 2: L1 Direct Bonus Non-Duplication on Repeated Activation', () => {
        it('should credit L1 direct commission exactly once on initial activation', () => {
            const referrer = db.createUser({
                name: 'Referrer 1',
                email: 'ref1@test.com',
                referralWalletInr: 0
            });

            const investor = db.createUser({
                name: 'Investor 1',
                email: 'inv1@test.com',
                referredBy: 'ref1@test.com'
            });

            const investment = db.createInvestment({
                userId: investor._id,
                amount: 100000,
                status: 'pending'
            });

            const result = db.processInvestmentActivation(investment._id);
            assert.equal(result.success, true);

            // Verify Referrer received ₹5,000 once
            const updatedReferrer = db.users.get(referrer._id);
            assert.equal(updatedReferrer.referralWalletInr, 5000);

            // Verify exactly 1 referral_bonus transaction
            const refTxs = db.transactions.filter(t => t.userId === referrer._id && t.type === 'referral_bonus');
            assert.equal(refTxs.length, 1);
            assert.equal(refTxs[0].amount, 5000);
        });

        it('should strictly reject repeated activation attempts and prevent duplicate crediting', () => {
            const referrer = db.createUser({
                name: 'Referrer 1',
                email: 'ref1@test.com',
                referralWalletInr: 0
            });

            const investor = db.createUser({
                name: 'Investor 1',
                email: 'inv1@test.com',
                referredBy: 'ref1@test.com'
            });

            const investment = db.createInvestment({
                userId: investor._id,
                amount: 100000,
                status: 'pending'
            });

            // First activation
            const firstCall = db.processInvestmentActivation(investment._id);
            assert.equal(firstCall.success, true);

            // Immediate second activation call (e.g. duplicate API request / retry)
            const secondCall = db.processInvestmentActivation(investment._id);
            assert.equal(secondCall.success, false);

            // Third activation attempt
            const thirdCall = db.processInvestmentActivation(investment._id);
            assert.equal(thirdCall.success, false);

            // Verify Referrer wallet balance remains strictly ₹5,000 (no duplicate increments)
            const updatedReferrer = db.users.get(referrer._id);
            assert.equal(updatedReferrer.referralWalletInr, 5000);

            // Verify only 1 transaction exists
            const refTxs = db.transactions.filter(t => t.userId === referrer._id && t.type === 'referral_bonus');
            assert.equal(refTxs.length, 1);
        });

        it('should handle simulated concurrent activation races with atomic locking', () => {
            const referrer = db.createUser({
                name: 'Referrer 1',
                email: 'ref1@test.com',
                referralWalletInr: 0
            });

            const investor = db.createUser({
                name: 'Investor 1',
                email: 'inv1@test.com',
                referredBy: 'ref1@test.com'
            });

            const investment = db.createInvestment({
                userId: investor._id,
                amount: 200000,
                status: 'pending'
            });

            // Simulate 5 simultaneous worker threads trying to activate the same investment
            const outcomes = [1, 2, 3, 4, 5].map(() => db.processInvestmentActivation(investment._id));

            const successCount = outcomes.filter(r => r.success).length;
            const failCount = outcomes.filter(r => !r.success).length;

            assert.equal(successCount, 1, 'Exactly one concurrent call must succeed');
            assert.equal(failCount, 4, 'Remaining concurrent calls must fail');

            const updatedReferrer = db.users.get(referrer._id);
            assert.equal(updatedReferrer.referralWalletInr, 10000); // 5% of 200k
        });
    });

    describe('Tier 2 & 3: L2 Monthly Residual Non-Duplication in Cron Payouts', () => {
        it('should credit monthly residual commission exactly once per scheduled month', () => {
            const referrer = db.createUser({
                name: 'Referrer 2',
                email: 'ref2@test.com',
                referralWalletInr: 0
            });

            const investor = db.createUser({
                name: 'Investor 2',
                email: 'inv2@test.com',
                referredBy: 'ref2@test.com',
                limitedRateOverride: 0.06 // 6% monthly payout = 6k
            });

            const investment = db.createInvestment({
                userId: investor._id,
                amount: 100000,
                schemeType: 'limited_inr',
                status: 'active',
                paidMonths: []
            });

            // Process Month 1
            const resMonth1 = db.processMonthlyInterestPayoutForMonth(investment._id, 1);
            assert.equal(resMonth1.success, true);

            // Referrer should have ₹300 (5% of ₹6,000)
            let currentReferrer = db.users.get(referrer._id);
            assert.equal(currentReferrer.referralWalletInr, 300);

            // Re-run Month 1 cron execution (e.g. hourly cron triggers again)
            const duplicateRun = db.processMonthlyInterestPayoutForMonth(investment._id, 1);
            assert.equal(duplicateRun.success, false);

            // Referrer wallet MUST NOT change
            currentReferrer = db.users.get(referrer._id);
            assert.equal(currentReferrer.referralWalletInr, 300);

            // Process Month 2
            const resMonth2 = db.processMonthlyInterestPayoutForMonth(investment._id, 2);
            assert.equal(resMonth2.success, true);

            currentReferrer = db.users.get(referrer._id);
            assert.equal(currentReferrer.referralWalletInr, 600); // 300 + 300
        });

        it('should guarantee idempotency when cron executes 10 duplicate runs for each month', () => {
            const referrer = db.createUser({
                name: 'Referrer 3',
                email: 'ref3@test.com',
                referralWalletInr: 0
            });

            const investor = db.createUser({
                name: 'Investor 3',
                email: 'inv3@test.com',
                referredBy: 'ref3@test.com',
                limitedRateOverride: 0.04 // standard 4% = 4k yield -> 200 residual
            });

            const investment = db.createInvestment({
                userId: investor._id,
                amount: 100000,
                schemeType: 'limited_inr',
                status: 'active',
                paidMonths: []
            });

            // Run 6 months, firing each month 10 times
            for (let m = 1; m <= 6; m++) {
                for (let attempt = 1; attempt <= 10; attempt++) {
                    db.processMonthlyInterestPayoutForMonth(investment._id, m);
                }
            }

            // Verify investment paidMonths contains exactly [1, 2, 3, 4, 5, 6] without duplicates
            const invRecord = db.investments.get(investment._id);
            assert.deepEqual(invRecord.paidMonths, [1, 2, 3, 4, 5, 6]);

            // Referrer total residual should be exactly 6 * 200 = 1200
            const updatedReferrer = db.users.get(referrer._id);
            assert.equal(updatedReferrer.referralWalletInr, 1200);

            // Referrer transactions count should be exactly 6
            const refTxs = db.transactions.filter(t => t.userId === referrer._id && t.type === 'referral_bonus');
            assert.equal(refTxs.length, 6);

            // Investor wallet should be exactly 6 * 4000 = 24000
            const updatedInvestor = db.users.get(investor._id);
            assert.equal(updatedInvestor.inrWallet, 24000);
        });

        it('should skip payout processing if investment is not active or not limited_inr', () => {
            const investor = db.createUser({ name: 'Inv 4', email: 'inv4@test.com' });
            
            // Completed investment
            const completedInv = db.createInvestment({
                userId: investor._id,
                schemeType: 'limited_inr',
                status: 'completed',
                paidMonths: [1, 2, 3, 4, 5, 6]
            });
            const res1 = db.processMonthlyInterestPayoutForMonth(completedInv._id, 1);
            assert.equal(res1.success, false);

            // 6m_inr investment (lump-sum scheme, not monthly)
            const lumpSumInv = db.createInvestment({
                userId: investor._id,
                schemeType: '6m_inr',
                status: 'active',
                paidMonths: []
            });
            const res2 = db.processMonthlyInterestPayoutForMonth(lumpSumInv._id, 1);
            assert.equal(res2.success, false);
        });
    });
});
