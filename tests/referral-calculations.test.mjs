import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateReferralCommission } from '../lib/referralUtils.js';

/**
 * Pure calculation helpers implementing the business rules specified in ORIGINAL_REQUEST.md & PROJECT.md
 */
export function computeL1DirectCommission(principal, referrerRate = null) {
    if (!principal || principal <= 0) return 0;
    if (referrerRate !== null && referrerRate !== undefined) {
        const rate = referrerRate > 1 ? referrerRate / 100 : referrerRate;
        return Math.round(principal * rate);
    }
    return calculateReferralCommission(principal);
}

export function computeMonthlyInvestorYield(principal, investorRateOverride = null) {
    if (!principal || principal <= 0) return 0;
    const rate = investorRateOverride !== null && investorRateOverride !== undefined
        ? (investorRateOverride > 1 ? investorRateOverride / 100 : investorRateOverride)
        : 0.04;
    return Math.round(principal * rate);
}

export function computeL2MonthlyResidualCommission(monthlyYield) {
    if (!monthlyYield || monthlyYield <= 0) return 0;
    return calculateReferralCommission(monthlyYield);
}

export function computeTotalTwoTierCommission({
    principal,
    currency = 'INR',
    schemeType = 'limited_inr',
    monthsPaid = 6,
    investorRateOverride = null,
    referrerRateOverride = null
}) {
    const l1 = computeL1DirectCommission(principal, referrerRateOverride);
    let l2PerMonth = 0;
    let l2Total = 0;

    if (schemeType === 'limited_inr' && currency === 'INR') {
        const monthlyYield = computeMonthlyInvestorYield(principal, investorRateOverride);
        l2PerMonth = computeL2MonthlyResidualCommission(monthlyYield);
        l2Total = l2PerMonth * Math.max(0, Math.min(monthsPaid, 6));
    }

    return {
        l1Direct: l1,
        l2PerMonth,
        l2Total,
        totalCommission: l1 + l2Total
    };
}

describe('Tier 1 & 3: Two-Tier Referral Commission Calculations', () => {
    describe('Tier 1: Level 1 (Direct 5% Bonus) Calculations', () => {
        it('should calculate 5% direct commission on INR principal investments', () => {
            assert.equal(computeL1DirectCommission(100000), 5000);
            assert.equal(computeL1DirectCommission(200000), 10000);
            assert.equal(computeL1DirectCommission(500000), 25000);
            assert.equal(computeL1DirectCommission(1000000), 50000);
        });

        it('should calculate 5% direct commission on USD principal investments', () => {
            assert.equal(computeL1DirectCommission(1000), 50);
            assert.equal(computeL1DirectCommission(2000), 100);
            assert.equal(computeL1DirectCommission(5000), 250);
            assert.equal(computeL1DirectCommission(10000), 500);
        });

        it('should handle custom referrer rate overrides (e.g. 7% or 0.08)', () => {
            // Referrer has 7% override
            assert.equal(computeL1DirectCommission(100000, 0.07), 7000);
            assert.equal(computeL1DirectCommission(100000, 7), 7000);

            // Referrer has 8% override
            assert.equal(computeL1DirectCommission(200000, 0.08), 16000);
            assert.equal(computeL1DirectCommission(200000, 8), 16000);

            // Referrer has 10% override on USD
            assert.equal(computeL1DirectCommission(1000, 0.10), 100);
        });
    });

    describe('Tier 1: Level 2 (Recurring 5% Monthly Residual) Calculations', () => {
        it('should calculate monthly residual for standard 4% Limited INR plan (₹1L -> ₹4k ROI -> ₹200/mo commission)', () => {
            const principal = 100000;
            const yieldAmount = computeMonthlyInvestorYield(principal, 0.04);
            assert.equal(yieldAmount, 4000);

            const residualPerMonth = computeL2MonthlyResidualCommission(yieldAmount);
            assert.equal(residualPerMonth, 200);

            const full6MonthResidual = residualPerMonth * 6;
            assert.equal(full6MonthResidual, 1200);
        });

        it('should calculate monthly residual for 6% Limited Offer plan (₹1L -> ₹6k ROI -> ₹300/mo commission)', () => {
            const principal = 100000;
            const yieldAmount = computeMonthlyInvestorYield(principal, 0.06);
            assert.equal(yieldAmount, 6000);

            const residualPerMonth = computeL2MonthlyResidualCommission(yieldAmount);
            assert.equal(residualPerMonth, 300);

            const full6MonthResidual = residualPerMonth * 6;
            assert.equal(full6MonthResidual, 1800);
        });

        it('should calculate monthly residual for high principal (₹5,00,000 @ 6% -> ₹30k ROI -> ₹1,500/mo)', () => {
            const principal = 500000;
            const yieldAmount = computeMonthlyInvestorYield(principal, 0.06);
            assert.equal(yieldAmount, 30000);

            const residualPerMonth = computeL2MonthlyResidualCommission(yieldAmount);
            assert.equal(residualPerMonth, 1500);

            const full6MonthResidual = residualPerMonth * 6;
            assert.equal(full6MonthResidual, 9000);
        });

        it('should calculate monthly residual for partial progress (e.g. Month 1, Month 3, Month 6)', () => {
            const principal = 100000;
            const resMonth1 = computeTotalTwoTierCommission({ principal, monthsPaid: 1, investorRateOverride: 0.06 });
            assert.equal(resMonth1.l2Total, 300);
            assert.equal(resMonth1.totalCommission, 5300); // 5000 + 300

            const resMonth3 = computeTotalTwoTierCommission({ principal, monthsPaid: 3, investorRateOverride: 0.06 });
            assert.equal(resMonth3.l2Total, 900);
            assert.equal(resMonth3.totalCommission, 5900); // 5000 + 900

            const resMonth6 = computeTotalTwoTierCommission({ principal, monthsPaid: 6, investorRateOverride: 0.06 });
            assert.equal(resMonth6.l2Total, 1800);
            assert.equal(resMonth6.totalCommission, 6800); // 5000 + 1800
        });
    });

    describe('Tier 3: Pairwise Combinatorial & Scheme Matrix Testing', () => {
        const testMatrix = [
            // [scheme, currency, principal, invRate, refRate, paidMonths, expL1, expL2PerMo, expL2Tot, expTotal]
            ['limited_inr', 'INR', 100000, 0.06, null, 6, 5000, 300, 1800, 6800],
            ['limited_inr', 'INR', 100000, 0.04, null, 6, 5000, 200, 1200, 6200],
            ['limited_inr', 'INR', 200000, 0.05, null, 4, 10000, 500, 2000, 12000],
            ['limited_inr', 'INR', 500000, 0.06, 0.08, 6, 40000, 1500, 9000, 49000],
            ['limited_inr', 'INR', 50000, 0.04, null, 2, 2500, 100, 200, 2700],
            ['3m_inr', 'INR', 100000, null, null, 0, 5000, 0, 0, 5000],
            ['6m_inr', 'INR', 200000, null, null, 0, 10000, 0, 0, 10000],
            ['1y_inr', 'INR', 500000, null, null, 0, 25000, 0, 0, 25000],
            ['5y_inr', 'INR', 1000000, null, null, 0, 50000, 0, 0, 50000],
            ['3m_usd', 'USD', 1000, null, null, 0, 50, 0, 0, 50],
            ['6m_usd', 'USD', 5000, null, null, 0, 250, 0, 0, 250],
            ['1y_usd', 'USD', 10000, null, null, 0, 500, 0, 0, 500],
            ['5y_usd', 'USD', 25000, null, 0.07, 0, 1750, 0, 0, 1750]
        ];

        testMatrix.forEach(([scheme, currency, principal, invRate, refRate, paidMonths, expL1, expL2PerMo, expL2Tot, expTotal]) => {
            it(`should correctly evaluate ${scheme} (${currency} ${principal}) [invRate=${invRate}, refRate=${refRate}, paidMonths=${paidMonths}]`, () => {
                const result = computeTotalTwoTierCommission({
                    principal,
                    currency,
                    schemeType: scheme,
                    monthsPaid: paidMonths,
                    investorRateOverride: invRate,
                    referrerRateOverride: refRate
                });

                assert.equal(result.l1Direct, expL1, `L1 Direct bonus mismatch for ${scheme}`);
                assert.equal(result.l2PerMonth, expL2PerMo, `L2 per month mismatch for ${scheme}`);
                assert.equal(result.l2Total, expL2Tot, `L2 total mismatch for ${scheme}`);
                assert.equal(result.totalCommission, expTotal, `Total commission mismatch for ${scheme}`);
            });
        });

        it('should verify percentage formatting variations in rates (e.g. 5 vs 0.05, 6 vs 0.06)', () => {
            const resDec = computeTotalTwoTierCommission({
                principal: 100000,
                schemeType: 'limited_inr',
                monthsPaid: 6,
                investorRateOverride: 0.06,
                referrerRateOverride: 0.05
            });

            const resPct = computeTotalTwoTierCommission({
                principal: 100000,
                schemeType: 'limited_inr',
                monthsPaid: 6,
                investorRateOverride: 6,
                referrerRateOverride: 5
            });

            assert.deepEqual(resDec, resPct);
            assert.equal(resPct.totalCommission, 6800);
        });
    });
});
