## 2026-07-05T03:05:05Z

Update the Hashprime company website "About Us" page, SEO metadata, and geographic SEO targeting with the provided engineering & infrastructure company description, mission, and vision statements.

Working directory: `/Users/mohammedarif/hashprime-main`
Integrity mode: development

## Requirements

### R1. About Page Content Update
Update the About Us page (`app/company/page.js`) and the landing page component (`components/AboutHashPrime.jsx`) with the exact description, mission, and vision text provided by the user:
- Description: "Hashprime is a multi-service engineering and infrastructure company dedicated to delivering reliable, innovative, and high-quality solutions across the telecom, electrical, construction, real estate, and technology sectors..."
- Mission: "To deliver dependable engineering, infrastructure, and technology solutions..."
- Vision: "To be recognized as one of India's most trusted engineering and technology companies..."

### R2. SEO Metadata & Keywords Update
Remove all remaining digital asset/cryptocurrency SEO keywords, meta tags, and description strings, and replace them with engineering, telecom infrastructure, electrical, real estate, and technology keywords/descriptions.

### R3. Geographic (GEO) SEO Optimization
Incorporate India-focused engineering and technology market targeting (National level targeting) across layouts, meta tags, and JSON-LD schemas.

## Acceptance Criteria

### Content Correctness
- [ ] The updated "About Us" content matches the user-provided text exactly on both `/company` and the home page.
- [ ] All references to cryptocurrency are completely removed from keywords, metadata, and site descriptions.

### Build and SEO Standards
- [ ] Next.js metadata is updated to target engineering, telecom infrastructure, and Indian markets (National level targeting).
- [ ] The application compiles successfully under `npm run build` without any compilation errors.

## 2026-08-22T02:52:39Z

Implement a two-tier referral commission system for the Hashprime Next.js + MongoDB investment platform, covering a one-time 5% direct commission on initial investment and a recurring 5% monthly commission on each referred user's monthly ROI payout.

Working directory: /Users/mohammedarif/hashprime-main
Integrity mode: development

---

## Context & Codebase Reference

The codebase is a Next.js 14 App Router project backed by MongoDB/Mongoose. Key files:

- **`lib/cron.js`** — hourly cron that runs `processInterestPayments()` (credits monthly ROI to `limited_inr` investors on the 1st of each month) and `processMaturedInvestments()`.
- **`lib/referralUtils.js`** — `calculateReferralCommission(amount)` returns `amount * 0.05` (one-time direct commission only).
- **`app/api/referrals/route.js`** — GET endpoint that returns `referredUsers`, `referralTxs`, and `totalEarned` for the logged-in user.
- **`app/dashboard/referrals/page.js`** — Client-side referral dashboard showing referral link, balance, referred users table, and transaction history.
- **`models/User.js`** — Has `referralWallet` (USD) and `referralWalletInr` (INR) fields. `referredBy` stores the referrer's email.
- **`models/Investment.js`** — Has `schemeType`, `amount`, `paidMonths[]`, `status`. `limited_inr` is the monthly-payout scheme.
- **`models/Transaction.js`** — `type` enum includes `'referral_bonus'`.

The one-time L1 commission (5% of initial investment) is already partially implemented in `calculateReferralCommission` and called during investment onboarding. The L2 recurring commission is NOT yet implemented.

---

## Requirements

### R1. Level 1 — Instant Direct Referral Commission (5%)
When a referred user's investment is confirmed/activated, credit 5% of their invested amount to the referrer's `referralWalletInr` (for INR investments) or `referralWallet` (for USD investments). Create a `Transaction` record with `type: 'referral_bonus'` and a description clearly labeling it as a direct referral bonus (e.g., `"Direct Referral Bonus — [referred user name]"`). This must be idempotent — no double-crediting if called twice for the same investment.

### R2. Level 2 — Recurring Monthly Commission (5% of Referred User's Monthly Payout)
Each time the cron in `lib/cron.js` credits a monthly ROI payout to an investor (inside `processInterestPayments()`), also compute 5% of that monthly payout amount and credit it to the investor's referrer's `referralWalletInr`. Create a `Transaction` record for the referrer with `type: 'referral_bonus'` and a description like `"Monthly Referral Commission — [referred user name] Month [N]"`. This must also be idempotent — each (investment, month, level) tuple must only pay out once.

### R3. Referral Dashboard UI
Update `app/dashboard/referrals/page.js` to clearly present both earning streams:
- A visual breakdown section (e.g., two cards or two rows) that shows: **Upfront 5% Referral Bonus** (one-time, triggered on investment activation) and **Ongoing 5% Monthly Residual Bonus** (credited each payout cycle).
- For each referred user in the table, show both: the one-time commission earned and the cumulative monthly residual commissions earned to date, as separate columns or a tooltip/breakdown.
- Add a worked example or explainer tooltip: "Example: If your referral invests ₹1,00,000 at 6%/month — you earn ₹5,000 upfront + ₹300/month ongoing."

---

## Acceptance Criteria

### Backend — Level 1 (Direct Commission)
- [ ] When an investment is activated for a user who has a `referredBy` referrer, the referrer's `referralWalletInr` increases by exactly 5% of the investment amount (INR schemes).
- [ ] A `Transaction` record of `type: 'referral_bonus'` is created for the referrer with a description identifying it as a direct bonus.
- [ ] Calling the activation logic twice for the same investment does NOT double-credit the referrer.

### Backend — Level 2 (Monthly Residual Commission)
- [ ] Each time `processInterestPayments()` credits month M to investor X (who has a referrer), the referrer receives a `referral_bonus` transaction equal to 5% of that monthly payout.
- [ ] The monthly commission credit only fires once per (investment_id, month_number) — verified by checking that running the cron twice does not duplicate referrer credits.
- [ ] The `referralWalletInr` balance on the referrer's User document increases by the correct amount after each simulated payout cycle.

### Frontend — Dashboard
- [ ] The referral dashboard at `/dashboard/referrals` displays two distinct earning stream sections: one for upfront bonuses and one for monthly residual commissions.
- [ ] The "Referred Investors" table shows a column or breakdown for: one-time commission earned, cumulative monthly residual earned, and total.
- [ ] A tooltip or static example explains the two-tier structure with concrete numbers.
- [ ] No regressions: existing referral link copy, payout claim form, and claims history sections still work.
