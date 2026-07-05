/**
 * Utility to calculate referral commission at a strict 5% rate of the invested amount.
 * Example:
 *   - ₹10,00,000 investment = ₹50,000 commission
 *   - ₹10,00,00,000 investment = ₹50,00,000 commission
 *
 * @param {number} amount - The invested amount
 * @returns {number} The calculated 5% commission, rounded to nearest integer
 */
export function calculateReferralCommission(amount) {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    return Math.round(amount * 0.05);
}
