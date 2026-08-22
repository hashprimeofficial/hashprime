## 2026-08-22T02:57:13Z
You are Worker 1 (Milestone 1: Backend Models, L1 Direct Commission & Idempotency).
Your working directory is: `/Users/mohammedarif/hashprime-main/.agents/worker_m1`

Please read `/Users/mohammedarif/hashprime-main/.agents/ORIGINAL_REQUEST.md` and `/Users/mohammedarif/hashprime-main/.agents/PROJECT.md` first.
Refer to Explorer 1 findings at `/Users/mohammedarif/hashprime-main/.agents/explorer_models_l1/handoff.md`.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your File Ownership (Exclusive):
- `models/Investment.js`
- `models/Transaction.js`
- `models/User.js`
- `lib/referralUtils.js`
- `app/api/admin/investments/[id]/route.js`
- `app/api/admin/investments/route.js`
- `app/api/admin/users/[id]/transaction/route.js` (if needed for allowed fields)

Your Mission:
1. `models/Investment.js`: Add `directReferralPaid: { type: Boolean, default: false }`.
2. `models/Transaction.js`: Update `currency` enum to `['INR', 'USD', 'USDT']` (and allow `'payout'` or ensure compatibility with claims).
3. `lib/referralUtils.js`: Ensure `calculateReferralCommission(amount)` correctly calculates 5% (`Math.round(amount * 0.05)`) with robust numeric validation.
4. `app/api/admin/investments/[id]/route.js` (Approval & Activation):
   - Guard L1 commission credit with `!investment.directReferralPaid`.
   - Mark `directReferralPaid: true` atomically when activating and crediting.
   - When crediting: calculate commission (5% or referrer override), increment referrer `referralWalletInr` (for INR schemes) or `referralWallet` (for USD schemes) via `$inc`.
   - Create `Transaction` with `userId: referrer._id`, `type: 'referral_bonus'`, `currency: currency`, `description: "Direct Referral Bonus — " + user.name` (or `${referrerRate * 100}% Direct Referral Bonus — ${user.name}`).
   - Look up referrer by `User.findOne({ email: user.referredBy })`, with fallback to `referralCode` or `_id`.
5. `app/api/admin/investments/route.js` (Direct Creation):
   - Set `directReferralPaid: true` upon creation.
   - Perform identical L1 referral crediting logic and transaction creation.
6. Verify your implementation by running build and lint:
   `npm run build`
7. Write a detailed handoff report to `/Users/mohammedarif/hashprime-main/.agents/worker_m1/handoff.md`.
8. Send a message to the orchestrator when complete.
