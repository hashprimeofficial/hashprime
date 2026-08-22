import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateReferralCommission } from '../lib/referralUtils.js';

/**
 * Pure contract processor matching app/api/referrals/route.js specification
 */
export function buildReferralApiResponse({
    user,
    referredUsers = [],
    investmentsByUser = new Map(),
    referralTransactions = []
}) {
    const commissionRate = user.limitedRateOverride !== undefined && user.limitedRateOverride !== null
        ? (user.limitedRateOverride > 1 ? user.limitedRateOverride / 100 : user.limitedRateOverride)
        : 0.05;
    const commissionPct = commissionRate * 100;

    let totalUpfrontEarnedInr = 0;
    let totalUpfrontEarnedUsd = 0;
    let totalResidualEarnedInr = 0;
    let totalResidualEarnedUsd = 0;

    const enrichedReferredUsers = referredUsers.map((ru) => {
        const investments = (investmentsByUser.get(String(ru._id)) || []).filter(
            inv => inv.status === 'active' || inv.status === 'completed'
        );

        let totalInvestedInr = 0;
        let totalInvestedUsd = 0;
        let upfrontCommissionInr = 0;
        let upfrontCommissionUsd = 0;
        let monthlyResidualCommissionInr = 0;
        let monthlyResidualCommissionUsd = 0;

        for (const inv of investments) {
            if (inv.currency === 'USD') {
                totalInvestedUsd += inv.amount;
            } else {
                totalInvestedInr += inv.amount;

                // L2 Monthly Residual for limited_inr
                if (inv.schemeType === 'limited_inr' && inv.paidMonths && inv.paidMonths.length > 0) {
                    const investorRate = ru.limitedRateOverride !== undefined && ru.limitedRateOverride !== null
                        ? (ru.limitedRateOverride > 1 ? ru.limitedRateOverride / 100 : ru.limitedRateOverride)
                        : 0.04;
                    const monthlyYield = Math.round(inv.amount * investorRate);
                    const residualPerMonth = calculateReferralCommission(monthlyYield);
                    monthlyResidualCommissionInr += (inv.paidMonths.length * residualPerMonth);
                }
            }
        }

        // L1 Upfront Commission
        upfrontCommissionInr = user.limitedRateOverride !== undefined && user.limitedRateOverride !== null
            ? Math.round(totalInvestedInr * commissionRate)
            : calculateReferralCommission(totalInvestedInr);

        upfrontCommissionUsd = user.limitedRateOverride !== undefined && user.limitedRateOverride !== null
            ? Math.round((totalInvestedUsd * commissionRate) * 100) / 100
            : calculateReferralCommission(totalInvestedUsd);

        const totalCommissionInr = upfrontCommissionInr + monthlyResidualCommissionInr;
        const totalCommissionUsd = upfrontCommissionUsd + monthlyResidualCommissionUsd;

        totalUpfrontEarnedInr += upfrontCommissionInr;
        totalUpfrontEarnedUsd += upfrontCommissionUsd;
        totalResidualEarnedInr += monthlyResidualCommissionInr;
        totalResidualEarnedUsd += monthlyResidualCommissionUsd;

        return {
            _id: ru._id,
            name: ru.name,
            email: ru.email,
            createdAt: ru.createdAt,
            totalInvestedInr,
            totalInvestedUsd,
            commissionPct,
            upfrontCommissionInr,
            upfrontCommissionUsd,
            monthlyResidualCommissionInr,
            monthlyResidualCommissionUsd,
            totalCommissionInr,
            totalCommissionUsd,
            // Backward-compatible legacy aliases:
            commissionAmountInr: upfrontCommissionInr,
            commissionAmountUsd: upfrontCommissionUsd
        };
    });

    const totalEarned = referralTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    return {
        referralCode: user.referralCode || '',
        referredUsers: enrichedReferredUsers,
        referralTxs: referralTransactions,
        totalEarned,
        totalUpfrontEarnedInr,
        totalUpfrontEarnedUsd,
        totalResidualEarnedInr,
        totalResidualEarnedUsd
    };
}

describe('Tier 1 & 3: Referral API Contract & Data Enrichment', () => {
    const mockReferrer = {
        _id: 'user_ref_001',
        name: 'Master Referrer',
        email: 'referrer@example.com',
        referralCode: 'REF12345',
        limitedRateOverride: null
    };

    describe('Tier 1: Response Schema Conformity & Field Structure', () => {
        it('should return complete JSON payload structure with all required two-tier fields', () => {
            const response = buildReferralApiResponse({
                user: mockReferrer,
                referredUsers: [],
                investmentsByUser: new Map(),
                referralTransactions: []
            });

            // Top-level structure assertions
            assert.ok('referralCode' in response, 'Missing referralCode in response');
            assert.ok('referredUsers' in response, 'Missing referredUsers in response');
            assert.ok('referralTxs' in response, 'Missing referralTxs in response');
            assert.ok('totalEarned' in response, 'Missing totalEarned in response');
            assert.ok('totalUpfrontEarnedInr' in response, 'Missing totalUpfrontEarnedInr in response');
            assert.ok('totalResidualEarnedInr' in response, 'Missing totalResidualEarnedInr in response');
            assert.ok('totalUpfrontEarnedUsd' in response, 'Missing totalUpfrontEarnedUsd in response');
            assert.ok('totalResidualEarnedUsd' in response, 'Missing totalResidualEarnedUsd in response');

            assert.equal(typeof response.referralCode, 'string');
            assert.equal(Array.isArray(response.referredUsers), true);
            assert.equal(Array.isArray(response.referralTxs), true);
            assert.equal(typeof response.totalEarned, 'number');
            assert.equal(typeof response.totalUpfrontEarnedInr, 'number');
            assert.equal(typeof response.totalResidualEarnedInr, 'number');
        });

        it('should structure each enriched referred user with all required two-tier metrics and legacy fields', () => {
            const mockInvestor = {
                _id: 'inv_user_001',
                name: 'Alice Investor',
                email: 'alice@example.com',
                createdAt: new Date('2026-01-01')
            };

            const investments = [
                {
                    _id: 'inv_001',
                    schemeType: 'limited_inr',
                    amount: 100000,
                    currency: 'INR',
                    status: 'active',
                    paidMonths: [1, 2, 3]
                }
            ];

            const response = buildReferralApiResponse({
                user: mockReferrer,
                referredUsers: [mockInvestor],
                investmentsByUser: new Map([[mockInvestor._id, investments]]),
                referralTransactions: []
            });

            const userEntry = response.referredUsers[0];
            assert.ok(userEntry, 'Expected user entry to exist');
            assert.equal(userEntry.name, 'Alice Investor');
            assert.equal(userEntry.email, 'alice@example.com');
            assert.equal(userEntry.totalInvestedInr, 100000);
            assert.equal(userEntry.totalInvestedUsd, 0);
            assert.equal(userEntry.commissionPct, 5);

            // Upfront L1
            assert.equal(userEntry.upfrontCommissionInr, 5000);
            assert.equal(userEntry.upfrontCommissionUsd, 0);

            // Residual L2 (3 months @ 4% standard = 4k ROI -> 200/mo * 3 = 600)
            assert.equal(userEntry.monthlyResidualCommissionInr, 600);
            assert.equal(userEntry.monthlyResidualCommissionUsd, 0);

            // Total Commission (5000 + 600 = 5600)
            assert.equal(userEntry.totalCommissionInr, 5600);
            assert.equal(userEntry.totalCommissionUsd, 0);

            // Backward compatibility
            assert.equal(userEntry.commissionAmountInr, 5000);
            assert.equal(userEntry.commissionAmountUsd, 0);
        });

        it('should correctly handle zero-investment referrals without errors or NaN values', () => {
            const mockInvestor = {
                _id: 'inv_user_zero',
                name: 'Bob Zero',
                email: 'bob@example.com',
                createdAt: new Date('2026-01-01')
            };

            const response = buildReferralApiResponse({
                user: mockReferrer,
                referredUsers: [mockInvestor],
                investmentsByUser: new Map([[mockInvestor._id, []]]),
                referralTransactions: []
            });

            const userEntry = response.referredUsers[0];
            assert.equal(userEntry.totalInvestedInr, 0);
            assert.equal(userEntry.totalInvestedUsd, 0);
            assert.equal(userEntry.upfrontCommissionInr, 0);
            assert.equal(userEntry.monthlyResidualCommissionInr, 0);
            assert.equal(userEntry.totalCommissionInr, 0);
            assert.equal(response.totalUpfrontEarnedInr, 0);
            assert.equal(response.totalResidualEarnedInr, 0);
            assert.equal(response.totalEarned, 0);
        });

        it('should ignore pending or cancelled investments during active commission aggregation', () => {
            const mockInvestor = {
                _id: 'inv_user_pending',
                name: 'Charlie Pending',
                email: 'charlie@example.com',
                createdAt: new Date('2026-01-01')
            };

            const investments = [
                {
                    _id: 'inv_pending',
                    schemeType: 'limited_inr',
                    amount: 500000,
                    currency: 'INR',
                    status: 'pending',
                    paidMonths: []
                },
                {
                    _id: 'inv_cancelled',
                    schemeType: '6m_inr',
                    amount: 200000,
                    currency: 'INR',
                    status: 'cancelled',
                    paidMonths: []
                }
            ];

            const response = buildReferralApiResponse({
                user: mockReferrer,
                referredUsers: [mockInvestor],
                investmentsByUser: new Map([[mockInvestor._id, investments]]),
                referralTransactions: []
            });

            const userEntry = response.referredUsers[0];
            assert.equal(userEntry.totalInvestedInr, 0);
            assert.equal(userEntry.upfrontCommissionInr, 0);
            assert.equal(userEntry.monthlyResidualCommissionInr, 0);
            assert.equal(userEntry.totalCommissionInr, 0);
        });
    });

    describe('Tier 3: Multi-User Aggregate Calculations & Custom Overrides', () => {
        it('should correctly aggregate commissions across multiple investors with mixed schemes', () => {
            const user1 = { _id: 'u1', name: 'User 1', email: 'u1@test.com', limitedRateOverride: 0.06 };
            const user2 = { _id: 'u2', name: 'User 2', email: 'u2@test.com', limitedRateOverride: null };
            const user3 = { _id: 'u3', name: 'User 3', email: 'u3@test.com', limitedRateOverride: null };

            const invMap = new Map([
                ['u1', [
                    // limited_inr: 100k @ 6% -> 6k ROI -> 300/mo * 4 months = 1200 residual + 5000 upfront
                    { _id: 'i1', schemeType: 'limited_inr', amount: 100000, currency: 'INR', status: 'active', paidMonths: [1, 2, 3, 4] }
                ]],
                ['u2', [
                    // limited_inr: 200k @ 4% -> 8k ROI -> 400/mo * 6 months = 2400 residual + 10000 upfront
                    { _id: 'i2', schemeType: 'limited_inr', amount: 200000, currency: 'INR', status: 'completed', paidMonths: [1, 2, 3, 4, 5, 6] },
                    // 1y_inr: 50k lump sum -> 2500 upfront + 0 residual
                    { _id: 'i3', schemeType: '1y_inr', amount: 50000, currency: 'INR', status: 'active', paidMonths: [] }
                ]],
                ['u3', [
                    // 3m_usd: $2,000 -> $100 upfront USD + 0 residual
                    { _id: 'i4', schemeType: '3m_usd', amount: 2000, currency: 'USD', status: 'active', paidMonths: [] }
                ]]
            ]);

            const mockTxs = [
                { _id: 't1', userId: mockReferrer._id, amount: 5000, currency: 'INR', type: 'referral_bonus' },
                { _id: 't2', userId: mockReferrer._id, amount: 1200, currency: 'INR', type: 'referral_bonus' },
                { _id: 't3', userId: mockReferrer._id, amount: 12500, currency: 'INR', type: 'referral_bonus' },
                { _id: 't4', userId: mockReferrer._id, amount: 2400, currency: 'INR', type: 'referral_bonus' },
                { _id: 't5', userId: mockReferrer._id, amount: 100, currency: 'USD', type: 'referral_bonus' }
            ];

            const response = buildReferralApiResponse({
                user: mockReferrer,
                referredUsers: [user1, user2, user3],
                investmentsByUser: invMap,
                referralTransactions: mockTxs
            });

            // Check User 1
            assert.equal(response.referredUsers[0].upfrontCommissionInr, 5000);
            assert.equal(response.referredUsers[0].monthlyResidualCommissionInr, 1200);
            assert.equal(response.referredUsers[0].totalCommissionInr, 6200);

            // Check User 2 (Total Invested INR = 250,000 -> Upfront = 12,500; Residual = 2,400 -> Total = 14,900)
            assert.equal(response.referredUsers[1].totalInvestedInr, 250000);
            assert.equal(response.referredUsers[1].upfrontCommissionInr, 12500);
            assert.equal(response.referredUsers[1].monthlyResidualCommissionInr, 2400);
            assert.equal(response.referredUsers[1].totalCommissionInr, 14900);

            // Check User 3 (Total Invested USD = 2,000 -> Upfront = 100 USD)
            assert.equal(response.referredUsers[2].totalInvestedUsd, 2000);
            assert.equal(response.referredUsers[2].upfrontCommissionUsd, 100);
            assert.equal(response.referredUsers[2].totalCommissionUsd, 100);

            // Check Global Aggregates
            // Upfront INR: 5,000 + 12,500 = 17,500
            assert.equal(response.totalUpfrontEarnedInr, 17500);
            // Residual INR: 1,200 + 2,400 = 3,600
            assert.equal(response.totalResidualEarnedInr, 3600);
            // Upfront USD: 100
            assert.equal(response.totalUpfrontEarnedUsd, 100);
            assert.equal(response.totalResidualEarnedUsd, 0);

            // Total Earned from Transactions sum
            assert.equal(response.totalEarned, 21200);
        });

        it('should correctly apply referrer-level rate overrides across all referred users', () => {
            const customReferrer = {
                ...mockReferrer,
                limitedRateOverride: 0.08 // 8% custom referrer rate
            };

            const investor = { _id: 'u_cov', name: 'Custom Inv', email: 'cov@test.com' };
            const invMap = new Map([
                ['u_cov', [
                    { _id: 'i_c', schemeType: 'limited_inr', amount: 100000, currency: 'INR', status: 'active', paidMonths: [1, 2] }
                ]]
            ]);

            const response = buildReferralApiResponse({
                user: customReferrer,
                referredUsers: [investor],
                investmentsByUser: invMap,
                referralTransactions: []
            });

            // 8% upfront on 100,000 = 8,000
            assert.equal(response.referredUsers[0].commissionPct, 8);
            assert.equal(response.referredUsers[0].upfrontCommissionInr, 8000);
            // 4% ROI = 4,000 -> 5% residual = 200/mo * 2 = 400
            assert.equal(response.referredUsers[0].monthlyResidualCommissionInr, 400);
            assert.equal(response.referredUsers[0].totalCommissionInr, 8400);
            assert.equal(response.totalUpfrontEarnedInr, 8000);
            assert.equal(response.totalResidualEarnedInr, 400);
        });
    });
});
