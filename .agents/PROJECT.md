# Project: Two-Tier Referral Commission System

## Architecture
Hashprime is a Next.js 14 (App Router) + MongoDB (Mongoose) investment platform.
The referral system comprises:
1. **User Referral Binding**: Users register with a referral link/code. Referrer's email is stored in `User.referredBy`.
2. **Level 1 (Direct Commission)**: When an investment is activated (via admin approval or direct creation), 5% of principal is credited to the referrer's `referralWalletInr` (or `referralWallet` for USD) and recorded in `Transaction` with `type: 'referral_bonus'`.
3. **Level 2 (Recurring Monthly Commission)**: When monthly ROI payouts are processed for `limited_inr` active investments (via `lib/cron.js` `processInterestPayments()` or manual payout), 5% of the investor's monthly interest yield is credited to the referrer's `referralWalletInr` and recorded in `Transaction` with `type: 'referral_bonus'`.
4. **Referral Reporting & API**: `app/api/referrals/route.js` computes both L1 upfront and L2 cumulative monthly residual commissions per referred investor and aggregate totals.
5. **Referral Dashboard UI**: `app/dashboard/referrals/page.js` displays a 2-tier breakdown overview, a concrete worked example banner, a 5-column breakdown table of referred investors, transaction feeds with tier badges, and payout claim capabilities.
6. **Idempotency & Concurrency**: Atomic MongoDB operations (`findOneAndUpdate` with conditions on status and `paidMonths`) guarantee that commissions are never duplicated.

## Code Layout
- `models/User.js`: User model with `referralWalletInr`, `referralWallet`, `referredBy`, `referralCode`.
- `models/Investment.js`: Investment model with `schemeType`, `status`, `amount`, `paidMonths`, `directReferralPaid`.
- `models/Transaction.js`: Ledger model with `type: 'referral_bonus'`, `currency: ['INR', 'USD', 'USDT']`, `amount`, `description`.
- `lib/referralUtils.js`: Helper functions including `calculateReferralCommission(amount)`.
- `lib/cron.js`: Cron runner with `processInterestPayments()` and `processMaturedInvestments()`.
- `app/api/admin/investments/[id]/route.js`: Admin investment approval & activation.
- `app/api/admin/investments/route.js`: Admin direct investment creation.
- `app/api/admin/investments/monthly-payout/route.js`: Manual monthly payout trigger.
- `app/api/referrals/route.js`: Referral query API endpoint.
- `app/dashboard/referrals/page.js`: Frontend Referral Dashboard UI.
- `tests/`: Test suites using Node native test runner (`node:test`, `node:assert/strict`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | L1 Direct Commission Calculation | 5% of invested capital on activation | M1 | ORIGINAL_REQUEST §R1 |
| F2 | L1 Idempotency | `directReferralPaid` flag and atomic status transition | M1 | ORIGINAL_REQUEST §R1 |
| F3 | L1 Wallet & Transaction Ledger | Credit `referralWalletInr`/`referralWallet`, `type: 'referral_bonus'`, clear description | M1 | ORIGINAL_REQUEST §R1 |
| F4 | L2 Recurring Monthly Commission | 5% of monthly ROI payout in `processInterestPayments()` | M2 | ORIGINAL_REQUEST §R2 |
| F5 | L2 Idempotency | Atomic `{ paidMonths: { $ne: m } }` locking | M2 | ORIGINAL_REQUEST §R2 |
| F6 | L2 Wallet & Transaction Ledger | Credit `referralWalletInr`, `type: 'referral_bonus'`, description `"Monthly Referral Commission — [Name] Month [m]"` | M2 | ORIGINAL_REQUEST §R2 |
| F7 | L2 Maturity & Admin Payout Parity | Consistent L2 crediting in `processMaturedInvestments()` and `monthly-payout` route | M2 | Explorer 2 Survey |
| F8 | Enhanced Referral API | Aggregates upfront L1 and residual L2 commissions per user and globally | M3 | ORIGINAL_REQUEST §R3 |
| F9 | Referral Dashboard UI | Two-tier cards, worked example banner, 5-column table, transaction badges, no regressions | M3 | ORIGINAL_REQUEST §R3 |
| F10 | Comprehensive Test Suite & Harness | Tiers 1-4 tests, idempotency validation, npm test integration | M4 | ORIGINAL_REQUEST Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Models & L1 Direct Commission | `models/`, `lib/referralUtils.js`, `app/api/admin/investments/` | none | IN_PROGRESS |
| 2 | M2: L2 Recurring Monthly Commission | `lib/cron.js`, `app/api/admin/investments/monthly-payout/` | M1 | PLANNED |
| 3 | M3: Referral API & Dashboard UI | `app/api/referrals/route.js`, `app/dashboard/referrals/page.js` | M1, M2 | PLANNED |
| 4 | M4: E2E Test Suite Creation | `tests/`, `package.json` test scripts, `TEST_READY.md` | none | IN_PROGRESS |
| 5 | M5: Final Verification & Adversarial Hardening | Full test pass, Tier 5 Adversarial testing, Reviewers, Forensic Audit | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### `calculateReferralCommission(amount: number): number`
- Input: Positive numeric amount
- Output: `Math.round(amount * 0.05)` (5% rounded to integer)

### L1 Activation Contract
- Input: `investment` with `status: 'pending'`, `amount`, `currency`, `userId`
- Action:
  - Transition `status: 'active'`, `directReferralPaid: true` atomically.
  - If `user.referredBy` exists and `!investment.directReferralPaid`:
    - Calculate commission (5% or referrer override).
    - Increment referrer `referralWalletInr` (INR) or `referralWallet` (USD).
    - Create `Transaction` with `userId: referrer._id`, `type: 'referral_bonus'`, `currency`, `description: "Direct Referral Bonus — [referred user name]"`.

### L2 Monthly Payout Contract
- Input: `investment` with `schemeType: 'limited_inr'`, `status: 'active'`, month `m` (1..6)
- Action:
  - Atomic push `paidMonths: m` with `{ paidMonths: { $ne: m } }`.
  - Increment investor `inrWallet` with `monthlyYield`.
  - Create investor `Transaction` with `type: 'investment'`.
  - If `user.referredBy` exists and `monthlyYield > 0`:
    - Calculate `referralCommission = calculateReferralCommission(monthlyYield)`.
    - Increment referrer `referralWalletInr` with `referralCommission`.
    - Create referrer `Transaction` with `type: 'referral_bonus'`, `amount: referralCommission`, `currency: 'INR'`, `description: "Monthly Referral Commission — [referred user name] Month [m]"`.

### Referral API Contract (`GET /api/referrals`)
- Output:
  ```json
  {
    "referralCode": "...",
    "referredUsers": [
      {
        "name": "...",
        "email": "...",
        "totalInvestedInr": 100000,
        "totalInvestedUsd": 0,
        "upfrontCommissionInr": 5000,
        "upfrontCommissionUsd": 0,
        "monthlyResidualCommissionInr": 1800,
        "monthlyResidualCommissionUsd": 0,
        "totalCommissionInr": 6800,
        "totalCommissionUsd": 0
      }
    ],
    "referralTxs": [...],
    "totalEarned": 6800,
    "totalUpfrontEarnedInr": 5000,
    "totalResidualEarnedInr": 1800
  }
  ```
