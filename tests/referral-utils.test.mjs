import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateReferralCommission } from '../lib/referralUtils.js';

describe('Tier 1 & 2: Referral Commission Utility (calculateReferralCommission)', () => {
    describe('Tier 1: Standard Referral Calculations (5% Flat Rate)', () => {
        it('should correctly calculate 5% for standard INR investment amounts', () => {
            assert.equal(calculateReferralCommission(10000), 500);
            assert.equal(calculateReferralCommission(50000), 2500);
            assert.equal(calculateReferralCommission(100000), 5000);
            assert.equal(calculateReferralCommission(200000), 10000);
            assert.equal(calculateReferralCommission(500000), 25000);
            assert.equal(calculateReferralCommission(1000000), 50000);
            assert.equal(calculateReferralCommission(10000000), 500000);
        });

        it('should correctly calculate 5% for USD investment amounts', () => {
            assert.equal(calculateReferralCommission(100), 5);
            assert.equal(calculateReferralCommission(500), 25);
            assert.equal(calculateReferralCommission(1000), 50);
            assert.equal(calculateReferralCommission(2500), 125);
            assert.equal(calculateReferralCommission(5000), 250);
            assert.equal(calculateReferralCommission(10000), 500);
            assert.equal(calculateReferralCommission(100000), 5000);
        });

        it('should verify docstring examples (₹10L -> ₹50k, ₹10Cr -> ₹50L)', () => {
            assert.equal(calculateReferralCommission(1000000), 50000);
            assert.equal(calculateReferralCommission(100000000), 5000000);
        });

        it('should round correctly for fractional products', () => {
            // 20 * 0.05 = 1.0 -> 1
            assert.equal(calculateReferralCommission(20), 1);
            // 30 * 0.05 = 1.5 -> 2
            assert.equal(calculateReferralCommission(30), 2);
            // 10 * 0.05 = 0.5 -> 1
            assert.equal(calculateReferralCommission(10), 1);
            // 8 * 0.05 = 0.4 -> 0
            assert.equal(calculateReferralCommission(8), 0);
        });
    });

    describe('Tier 2: Boundary Values and Defensive Edge Cases', () => {
        it('should return 0 for zero amount', () => {
            assert.equal(calculateReferralCommission(0), 0);
            assert.equal(calculateReferralCommission(-0), 0);
        });

        it('should return 0 for negative numbers', () => {
            assert.equal(calculateReferralCommission(-1), 0);
            assert.equal(calculateReferralCommission(-100), 0);
            assert.equal(calculateReferralCommission(-100000), 0);
            assert.equal(calculateReferralCommission(-Infinity), 0);
        });

        it('should return 0 for null, undefined, and NaN', () => {
            assert.equal(calculateReferralCommission(null), 0);
            assert.equal(calculateReferralCommission(undefined), 0);
            assert.equal(calculateReferralCommission(NaN), 0);
        });

        it('should return 0 for empty or non-numeric string inputs', () => {
            assert.equal(calculateReferralCommission(''), 0);
            assert.equal(calculateReferralCommission('   '), 0);
            assert.equal(calculateReferralCommission('invalid'), 0);
            assert.equal(calculateReferralCommission('₹1,00,000'), 0);
            assert.equal(calculateReferralCommission('NaN'), 0);
        });

        it('should handle numeric string inputs with coercion', () => {
            assert.equal(calculateReferralCommission('100000'), 5000);
            assert.equal(calculateReferralCommission('50000'), 2500);
            assert.equal(calculateReferralCommission('1000'), 50);
        });

        it('should handle floating point investment amounts', () => {
            assert.equal(calculateReferralCommission(99.99), 5); // 99.99 * 0.05 = 4.9995 -> 5
            assert.equal(calculateReferralCommission(100.50), 5); // 100.50 * 0.05 = 5.025 -> 5
            assert.equal(calculateReferralCommission(0.4), 0); // 0.4 * 0.05 = 0.02 -> 0
            assert.equal(calculateReferralCommission(15.9), 1); // 15.9 * 0.05 = 0.795 -> 1
        });

        it('should handle large numbers and high boundary values', () => {
            assert.equal(calculateReferralCommission(1000000000), 50000000); // 1 Billion -> 50 Million
            assert.equal(calculateReferralCommission(5000000000), 250000000); // 5 Billion -> 250 Million
            const maxSafe = Number.MAX_SAFE_INTEGER;
            const expected = Math.round(maxSafe * 0.05);
            assert.equal(calculateReferralCommission(maxSafe), expected);
        });

        it('should safely handle non-primitive or non-number objects', () => {
            assert.equal(calculateReferralCommission({}), 0);
            assert.equal(calculateReferralCommission([]), 0);
            assert.equal(calculateReferralCommission([100000]), 5000); // array with single element coerces in JS
            assert.equal(calculateReferralCommission(false), 0);
            assert.equal(calculateReferralCommission(true), 0);
        });
    });
});
