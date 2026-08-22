/**
 * Utility to calculate referral commission at a strict 5% rate of the invested amount.
 * Example:
 *   - ₹1,00,000 investment = ₹5,000 commission
 *   - ₹10,00,000 investment = ₹50,000 commission
 *   - ₹10,00,00,000 investment = ₹50,00,000 commission
 *
 * @param {number|string} amount - The invested or payout amount
 * @returns {number} The calculated 5% commission, rounded to nearest integer
 */
export function calculateReferralCommission(amount) {
    const num = Number(amount);
    if (!num || isNaN(num) || num <= 0 || !isFinite(num)) return 0;
    return Math.round(num * 0.05);
}
