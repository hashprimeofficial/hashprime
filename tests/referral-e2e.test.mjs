import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateReferralCommission } from '../lib/referralUtils.js';
import { buildReferralApiResponse } from './referrals-api-contract.test.mjs';

/**
 * End-to-End Simulation Engine for the Hashprime Referral & Investment Platform
 */
class ReferralPlatformSimulator {
    constructor() {
        this.users = new Map();
        this.investments = new Map();
        this.transactions = [];
        this.claims = [];
    }

    registerUser({ name, email, referralCode = null, referredBy = null, limitedRateOverride = null }) {
        // Self-referral guard
        let effectiveReferredBy = referredBy;
        if (referredBy && (referredBy === email || referredBy === referralCode)) {
            effectiveReferredBy = null; // Disallow self-referral
        }

        const id = `usr_${email.replace(/[^a-z0-9]/gi, '_')}`;
        const user = {
            _id: id,
            name,
            email,
            referralCode: referralCode || `REF_${id.toUpperCase()}`,
            referredBy: effectiveReferredBy,
            inrWallet: 0,
            usdWallet: 0,
            referralWalletInr: 0,
            referralWallet: 0,
            limitedRateOverride
        };
        this.users.set(id, user);
        return user;
    }

    createAndActivateInvestment({ userEmail, amount, currency = 'INR', schemeType = 'limited_inr' }) {
        const user = Array.from(this.users.values()).find(u => u.email === userEmail);
        if (!user) throw new Error(`User not found: ${userEmail}`);

        const invId = `inv_${this.investments.size + 1}`;
        const investment = {
            _id: invId,
            userId: user._id,
            amount,
            currency,
            schemeType,
            status: 'active',
            directReferralPaid: true,
            paidMonths: [],
            createdAt: new Date(),
            maturesAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
        };
        this.investments.set(invId, investment);

        // Deduct investment amount from user (assume funded)
        // Record investment transaction
        this.transactions.push({
            _id: `tx_${this.transactions.length + 1}`,
            userId: user._id,
            type: 'investment',
            amount: -amount,
            currency,
            description: `Investment in ${schemeType} scheme`
        });

        // Process Level 1 Direct Referral Commission
        if (user.referredBy) {
            const referrer = Array.from(this.users.values()).find(
                u => u.email === user.referredBy || u.referralCode === user.referredBy
            );

            if (referrer && referrer._id !== user._id) {
                const commissionRate = referrer.limitedRateOverride || 0.05;
                const commissionAmount = referrer.limitedRateOverride
                    ? Math.round(amount * commissionRate)
                    : calculateReferralCommission(amount);

                if (currency === 'USD') {
                    referrer.referralWallet += commissionAmount;
                } else {
                    referrer.referralWalletInr += commissionAmount;
                }

                this.transactions.push({
                    _id: `tx_${this.transactions.length + 1}`,
                    userId: referrer._id,
                    type: 'referral_bonus',
                    amount: commissionAmount,
                    currency,
                    description: `Direct Referral Bonus — ${user.name}`
                });
            }
        }

        return investment;
    }

    processMonthlyCycle(monthNumber) {
        const activeLimitedInrInvestments = Array.from(this.investments.values()).filter(
            inv => inv.status === 'active' && inv.schemeType === 'limited_inr'
        );

        for (const inv of activeLimitedInrInvestments) {
            if (inv.paidMonths.includes(monthNumber)) {
                continue; // Already processed for this month
            }

            inv.paidMonths.push(monthNumber);
            const investor = this.users.get(inv.userId);
            const investorRate = investor.limitedRateOverride || 0.04;
            const monthlyYield = Math.round(inv.amount * investorRate);

            // 1. Credit investor ROI
            investor.inrWallet += monthlyYield;
            this.transactions.push({
                _id: `tx_${this.transactions.length + 1}`,
                userId: investor._id,
                type: 'investment',
                amount: monthlyYield,
                currency: 'INR',
                description: `Month ${monthNumber} returns`
            });

            // 2. Credit referrer Level 2 monthly residual
            if (investor.referredBy) {
                const referrer = Array.from(this.users.values()).find(
                    u => u.email === investor.referredBy || u.referralCode === investor.referredBy
                );

                if (referrer && referrer._id !== investor._id) {
                    const residualAmount = calculateReferralCommission(monthlyYield);
                    referrer.referralWalletInr += residualAmount;

                    this.transactions.push({
                        _id: `tx_${this.transactions.length + 1}`,
                        userId: referrer._id,
                        type: 'referral_bonus',
                        amount: residualAmount,
                        currency: 'INR',
                        description: `Monthly Referral Commission — ${investor.name} Month ${monthNumber}`
                    });
                }
            }
        }
    }

    processMaturity(investmentId) {
        const inv = this.investments.get(investmentId);
        if (!inv || inv.status !== 'active') return null;

        inv.status = 'completed';
        const investor = this.users.get(inv.userId);
        
        // Return principal
        if (inv.currency === 'USD') {
            investor.usdWallet += inv.amount;
        } else {
            investor.inrWallet += inv.amount;
        }

        this.transactions.push({
            _id: `tx_${this.transactions.length + 1}`,
            userId: investor._id,
            type: 'investment',
            amount: inv.amount,
            currency: inv.currency,
            description: 'Investment matured. Principal returned.'
        });

        return inv;
    }

    requestReferralClaim({ userEmail, amount, currency = 'INR', bankAccount = 'HDFC-001' }) {
        const user = Array.from(this.users.values()).find(u => u.email === userEmail);
        if (!user) throw new Error('User not found');

        const balanceField = currency === 'USD' ? 'referralWallet' : 'referralWalletInr';
        if (user[balanceField] < amount) {
            throw new Error(`Insufficient referral wallet balance: ${user[balanceField]} < ${amount}`);
        }

        // Deduct balance immediately upon request
        user[balanceField] -= amount;

        const claim = {
            _id: `claim_${this.claims.length + 1}`,
            userId: user._id,
            amount,
            currency,
            bankAccount,
            status: 'Pending',
            createdAt: new Date()
        };
        this.claims.push(claim);
        return claim;
    }

    approveReferralClaim(claimId) {
        const claim = this.claims.find(c => c._id === claimId);
        if (!claim || claim.status !== 'Pending') throw new Error('Invalid claim');

        claim.status = 'Approved';
        this.transactions.push({
            _id: `tx_${this.transactions.length + 1}`,
            userId: claim.userId,
            type: 'payout',
            amount: -claim.amount,
            currency: claim.currency,
            description: `Referral Payout Claim #${claim._id} Approved`
        });
        return claim;
    }

    getReferralDashboardData(userEmail) {
        const user = Array.from(this.users.values()).find(u => u.email === userEmail);
        if (!user) throw new Error('User not found');

        const referredUsers = Array.from(this.users.values()).filter(
            u => u.referredBy === user.email || u.referredBy === user.referralCode
        );

        const invMap = new Map();
        for (const ru of referredUsers) {
            const userInvs = Array.from(this.investments.values()).filter(i => i.userId === ru._id);
            invMap.set(ru._id, userInvs);
        }

        const userTxs = this.transactions.filter(
            t => t.userId === user._id && t.type === 'referral_bonus'
        );

        return buildReferralApiResponse({
            user,
            referredUsers,
            investmentsByUser: invMap,
            referralTransactions: userTxs
        });
    }
}

describe('Tier 4: Real-World E2E Referral Workload Scenarios', () => {
    describe('Scenario 1: Worked Example Lifecycle (₹1,00,000 @ 6% Limited Offer)', () => {
        it('should execute the exact 6-month lifecycle yielding ₹5,000 upfront + ₹1,800 residual = ₹6,800 total', () => {
            const sim = new ReferralPlatformSimulator();

            // 1. Referrer registers
            const referrer = sim.registerUser({
                name: 'Ananya Sharma',
                email: 'ananya@hashprime.io',
                referralCode: 'ANANYA5'
            });

            // 2. Referred investor registers with 6% special rate
            const investor = sim.registerUser({
                name: 'Kuppusamy R',
                email: 'kuppusamy@example.com',
                referredBy: 'ananya@hashprime.io',
                limitedRateOverride: 0.06
            });

            // 3. Month 0: Investor invests ₹1,00,000
            const investment = sim.createAndActivateInvestment({
                userEmail: 'kuppusamy@example.com',
                amount: 100000,
                schemeType: 'limited_inr'
            });

            // Verify Upfront Level 1 Commission
            assert.equal(referrer.referralWalletInr, 5000, 'Upfront commission must be ₹5,000 immediately');

            // 4. Months 1 through 6 payouts
            for (let m = 1; m <= 6; m++) {
                sim.processMonthlyCycle(m);

                // Investor receives ₹6,000 per month (6% of ₹1,00,000)
                assert.equal(investor.inrWallet, m * 6000, `Investor wallet after month ${m}`);

                // Referrer receives ₹300 per month (5% of ₹6,000)
                const expectedReferrerTotal = 5000 + (m * 300);
                assert.equal(referrer.referralWalletInr, expectedReferrerTotal, `Referrer wallet after month ${m}`);
            }

            // 5. Month 6: Investment Matures
            sim.processMaturity(investment._id);

            // Investor gets principal back (₹1,00,000 + 6*6,000 = ₹1,36,000)
            assert.equal(investor.inrWallet, 136000);

            // Referrer final balance is exactly ₹6,800
            assert.equal(referrer.referralWalletInr, 6800);

            // Verify API Response & Dashboard Contract
            const dashboard = sim.getReferralDashboardData('ananya@hashprime.io');
            assert.equal(dashboard.totalUpfrontEarnedInr, 5000);
            assert.equal(dashboard.totalResidualEarnedInr, 1800);
            assert.equal(dashboard.totalEarned, 6800);

            const referredUserCard = dashboard.referredUsers[0];
            assert.equal(referredUserCard.upfrontCommissionInr, 5000);
            assert.equal(referredUserCard.monthlyResidualCommissionInr, 1800);
            assert.equal(referredUserCard.totalCommissionInr, 6800);
        });
    });

    describe('Scenario 2: Multi-Investor Portfolio with Mixed Schemes & Currencies', () => {
        it('should accurately handle multi-tier calculations for a diverse portfolio of 4 investors', () => {
            const sim = new ReferralPlatformSimulator();

            const referrer = sim.registerUser({
                name: 'Vikram Mehta',
                email: 'vikram@hashprime.io',
                referralCode: 'VIKRAM_VIP'
            });

            // Investor A: ₹2,00,000 in limited_inr @ 6%
            sim.registerUser({ name: 'Investor A', email: 'a@test.com', referredBy: 'VIKRAM_VIP', limitedRateOverride: 0.06 });
            sim.createAndActivateInvestment({ userEmail: 'a@test.com', amount: 200000, schemeType: 'limited_inr' });

            // Investor B: ₹1,00,000 in limited_inr @ 4%
            sim.registerUser({ name: 'Investor B', email: 'b@test.com', referredBy: 'VIKRAM_VIP', limitedRateOverride: 0.04 });
            sim.createAndActivateInvestment({ userEmail: 'b@test.com', amount: 100000, schemeType: 'limited_inr' });

            // Investor C: ₹50,000 in 6m_inr lump sum
            sim.registerUser({ name: 'Investor C', email: 'c@test.com', referredBy: 'VIKRAM_VIP' });
            sim.createAndActivateInvestment({ userEmail: 'c@test.com', amount: 50000, schemeType: '6m_inr' });

            // Investor D: $2,000 in 3m_usd
            sim.registerUser({ name: 'Investor D', email: 'd@test.com', referredBy: 'VIKRAM_VIP' });
            sim.createAndActivateInvestment({ userEmail: 'd@test.com', amount: 2000, currency: 'USD', schemeType: '3m_usd' });

            // Check initial Upfront Commissions
            // INR Upfront: 5% of (200k + 100k + 50k) = 5% of 350k = ₹17,500
            // USD Upfront: 5% of $2,000 = $100 USD
            assert.equal(referrer.referralWalletInr, 17500);
            assert.equal(referrer.referralWallet, 100);

            // Simulate 3 months of payouts
            for (let m = 1; m <= 3; m++) {
                sim.processMonthlyCycle(m);
            }

            // Residuals after 3 months:
            // Investor A (200k @ 6% = 12k yield -> 600/mo * 3 = 1,800)
            // Investor B (100k @ 4% = 4k yield -> 200/mo * 3 = 600)
            // Total Residual = 1,800 + 600 = 2,400 INR
            // Referrer INR Wallet = 17,500 + 2,400 = ₹19,900
            assert.equal(referrer.referralWalletInr, 19900);
            assert.equal(referrer.referralWallet, 100);

            const dashboard = sim.getReferralDashboardData('vikram@hashprime.io');
            assert.equal(dashboard.referredUsers.length, 4);
            assert.equal(dashboard.totalUpfrontEarnedInr, 17500);
            assert.equal(dashboard.totalResidualEarnedInr, 2400);
            assert.equal(dashboard.totalUpfrontEarnedUsd, 100);
            assert.equal(dashboard.totalResidualEarnedUsd, 0);
        });
    });

    describe('Scenario 3: Self-Referral Prevention & Unreferred Workloads', () => {
        it('should prevent self-referral bonus generation when user enters own email or referral code', () => {
            const sim = new ReferralPlatformSimulator();

            // Self-referral attempt via email
            const selfUser1 = sim.registerUser({
                name: 'Self Investor 1',
                email: 'self1@test.com',
                referredBy: 'self1@test.com'
            });

            sim.createAndActivateInvestment({ userEmail: 'self1@test.com', amount: 100000, schemeType: 'limited_inr' });

            assert.equal(selfUser1.referralWalletInr, 0, 'Self-referrer must not receive referral bonus');

            // Self-referral attempt via referralCode
            const selfUser2 = sim.registerUser({
                name: 'Self Investor 2',
                email: 'self2@test.com',
                referralCode: 'SELF2_CODE',
                referredBy: 'SELF2_CODE'
            });

            sim.createAndActivateInvestment({ userEmail: 'self2@test.com', amount: 100000, schemeType: 'limited_inr' });
            assert.equal(selfUser2.referralWalletInr, 0);
        });

        it('should correctly process investments for users with no referrer without errors', () => {
            const sim = new ReferralPlatformSimulator();

            const organicUser = sim.registerUser({
                name: 'Organic Investor',
                email: 'organic@test.com',
                referredBy: null
            });

            sim.createAndActivateInvestment({ userEmail: 'organic@test.com', amount: 500000, schemeType: 'limited_inr' });

            sim.processMonthlyCycle(1);
            sim.processMonthlyCycle(2);

            assert.equal(organicUser.inrWallet, 40000); // 20k * 2
            assert.equal(organicUser.referralWalletInr, 0);
        });
    });

    describe('Scenario 4: Referral Claim Lifecycle (Earn -> Accumulate -> Claim -> Approve)', () => {
        it('should accurately track referral wallet balance throughout withdrawal claim lifecycle', () => {
            const sim = new ReferralPlatformSimulator();

            const referrer = sim.registerUser({
                name: 'Sunita Rao',
                email: 'sunita@hashprime.io'
            });

            sim.registerUser({
                name: 'Rahul Dev',
                email: 'rahul@test.com',
                referredBy: 'sunita@hashprime.io',
                limitedRateOverride: 0.06
            });

            // Rahul invests ₹1,00,000 -> Sunita gets ₹5,000 upfront
            sim.createAndActivateInvestment({ userEmail: 'rahul@test.com', amount: 100000, schemeType: 'limited_inr' });
            assert.equal(referrer.referralWalletInr, 5000);

            // Sunita requests a payout claim of ₹4,000
            const claim = sim.requestReferralClaim({
                userEmail: 'sunita@hashprime.io',
                amount: 4000,
                currency: 'INR'
            });

            assert.equal(claim.status, 'Pending');
            // Wallet immediately decrements to prevent double-spending
            assert.equal(referrer.referralWalletInr, 1000);

            // Month 1 & Month 2 payouts occur -> Sunita earns +₹300/mo * 2 = +₹600
            sim.processMonthlyCycle(1);
            sim.processMonthlyCycle(2);

            assert.equal(referrer.referralWalletInr, 1600); // 1000 + 600

            // Admin approves the ₹4,000 claim
            sim.approveReferralClaim(claim._id);
            assert.equal(claim.status, 'Approved');

            // Wallet remains ₹1,600 and payout is recorded in ledger
            assert.equal(referrer.referralWalletInr, 1600);
            const payoutTxs = sim.transactions.filter(t => t.userId === referrer._id && t.type === 'payout');
            assert.equal(payoutTxs.length, 1);
            assert.equal(payoutTxs[0].amount, -4000);
        });
    });
});
