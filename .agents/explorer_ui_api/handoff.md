# Handoff Report: Explorer 3 (Referral APIs, Dashboard UI & Test Infrastructure)

## 1. Observation

### 1.1 `app/api/referrals/route.js` (Lines 1–86)
- **Authentication & User Fetching**:
  - Authenticates via JWT cookie `auth_token` and `verifyToken(token)`.
  - Line 19: `User.findById(payload.userId).select('email referralCode limitedRateOverride')`.
- **Referred User Querying**:
  - Line 23–26:
    ```javascript
    const referredUsers = await User.find({ referredBy: user.email })
        .select('name email createdAt')
        .sort({ createdAt: -1 })
        .lean();
    ```
    *Note*: Queries solely by `referredBy: user.email`. Does not query by `user.referralCode` or `user._id`.
- **Commission Calculations for Referred Users (Lines 29–64)**:
  - Iterates over each referred user `ru` and queries active/completed investments:
    `Investment.find({ userId: ru._id, status: { $in: ['active', 'completed'] } })`.
  - Sums `totalInvestedInr` and `totalInvestedUsd`.
  - Calculates direct commission:
    `commissionAmountInr = calculateReferralCommission(totalInvestedInr)` (or uses `user.limitedRateOverride`).
    `commissionAmountUsd = calculateReferralCommission(totalInvestedUsd)`.
  - Pushes to `enrichedReferredUsers`.
  - **Critical Gap**: Does NOT compute or query the L2 cumulative monthly residual commissions earned from each referred user (e.g. from paid months of `limited_inr` investments or matching transaction records).
- **Transaction History & Total Earnings (Lines 67–78)**:
  - Line 67–70: `const referralTxs = await Transaction.find({ userId: payload.userId, type: 'referral_bonus' }).sort({ createdAt: -1 });`
  - Line 72: `const totalEarned = referralTxs.reduce((acc, t) => acc + t.amount, 0);`
  - Returns `{ referralCode, referredUsers, referralTxs, totalEarned }`.
  - **Critical Gap**: Does not return separate aggregates for Upfront L1 Direct Bonus vs Ongoing L2 Monthly Residuals.

---

### 1.2 `app/dashboard/referrals/page.js` (Lines 1–465)
- **Data Fetching**:
  - `useSWR('/api/auth/me')` -> `authData.user` (`referralWallet`, `referralWalletInr`, `email`, `_id`).
  - `useSWR('/api/referrals')` -> `data` (`referredUsers`, `referralTxs`, `totalEarned`, `referralCode`).
  - `useSWR('/api/referrals/claim')` -> `claimsData` (`claims`).
  - `useSWR('/api/exchange-rate')` -> `rateData` (`rate`).
  - `useSWR('/api/bank-accounts')` -> `bankData` (`bankAccounts`).
- **Header Section (Lines 136–139)**:
  - Displays "Referral Program: Invite investors and earn an instant bonus on every investment they make."
- **Top Row Cards (Lines 141–304)**:
  - **Card 1: Referral Link Card (Lines 143–170)**:
    - Generates link `${origin}/register?ref=${authData?.user?.email || userId}`.
    - Copy button (`copyRefLink`) with 2-second timeout confirmation.
    - Social share buttons for WhatsApp and Telegram.
  - **Card 2: Referral Wallet & Payout Claim Card (Lines 173–303)**:
    - Displays `referralWalletInr` and `referralWalletUsd` balances.
    - Modal/Inline claim form with currency toggle (INR / USD), amount validation, bank account selector, and submission to `POST /api/referrals/claim`.
    - States: `Request`, `Form`, `Submitting`, `Success`.
- **Referred Investors Table (Lines 306–367)**:
  - Table headers: `Name & Email`, `Invested Amount`, `Commission Rate`, `Commission Earned`.
  - Lines 330–336 contain a hardcoded fallback for a test user:
    ```javascript
    const isKuppusamy = u.email === 's.hanthikuppusamy1966@gmail.com' || u.name?.toLowerCase().includes('kuppusamy');
    const totalInr = isKuppusamy ? 500000 : (u.totalInvestedInr || 0);
    const totalUsd = isKuppusamy ? 0 : (u.totalInvestedUsd || 0);
    const commPct = isKuppusamy ? 5 : (u.commissionPct || 5);
    const commInr = isKuppusamy ? 25000 : (u.commissionAmountInr || 0);
    const commUsd = isKuppusamy ? 0 : (u.commissionAmountUsd || 0);
    ```
  - **Critical Gap**: Does not display separate columns or breakdown for Upfront One-Time Bonus vs Cumulative Monthly Residual Bonus.
- **Claims History Table (Lines 369–425)**:
  - Lists claims from `ReferralClaim` model (`createdAt`, `bankAccountId`, `amount` / `amountInr`, `status`).
- **Referral Bonus History List (Lines 427–461)**:
  - Lists all `referral_bonus` transactions with description, timestamp, and amount (`+₹X` or `+$Y USD`).

---

### 1.3 Related Endpoints & Models Inspected
1. **`app/api/referrals/claim/route.js`**:
   - `POST`: Validates balance (`referralWalletInr` or `referralWallet`), decrements balance immediately, creates `ReferralClaim` with `status: 'Pending'`.
   - `GET`: Returns claims for logged-in user populated with `bankAccountId`.
2. **`app/api/admin/referral-claims/[id]/approve/route.js`**:
   - Admin approves claim -> updates status to `'Approved'` -> creates `Transaction` with `type: 'payout'` (or `referral_bonus`).
3. **`app/api/dashboard/stats/route.js`**:
   - Queries `referralCount = await User.countDocuments({ referredBy: user.email })` and sums `referralCommissionEarnedInr` and `referralCommissionEarnedUsd` from `referral_bonus` transactions.
4. **`models/Transaction.js`**:
   - `type` enum: `['investment', 'referral_bonus', 'withdrawal', 'deposit']` (needs `'payout'` support or standardization).
   - `currency` enum: `['INR', 'USDT']` (needs `'USD'` support for consistency with `Investment.js`).

---

### 1.4 Test Infrastructure & Tooling
- **`package.json`**:
  - Scripts: `"dev": "next dev"`, `"build": "next build"`, `"start": "next start"`, `"lint": "eslint"`.
  - Dependencies: Next.js 16.1.6, React 19.2.3, Mongoose 9.2.2, Framer Motion 12.34.3, Lucide React 0.575.0, SWR 2.4.0.
  - No external test frameworks (Jest/Vitest/Mocha) are currently in `devDependencies`.
- **Node Environment**:
  - Node version: `v22.22.3`.
  - Node 22 includes the native `node:test` runner and `node:assert/strict` library out of the box, supporting ESM and parallel test execution without any external dependencies.

---

## 2. Logic Chain

### 2.1 Two-Tier Referral Data Structure (API -> UI)
1. **Separation of Earning Streams**:
   - **Level 1 (Upfront Direct Commission)**: 5% of direct initial investment amount, credited once upon investment activation.
   - **Level 2 (Monthly Residual Commission)**: 5% of the referred user's monthly interest payout (for `limited_inr` investments), credited every month during `processInterestPayments()`.
2. **Per-User Enrichment in `app/api/referrals/route.js`**:
   - For each referred user `ru`:
     - Upfront commission:
       `upfrontCommissionInr = calculateReferralCommission(totalInvestedInr)`
       `upfrontCommissionUsd = calculateReferralCommission(totalInvestedUsd)`
     - Monthly residual commission:
       For each active/completed `limited_inr` investment of `ru`:
       `monthlyYield = Math.round(inv.amount * (ru.limitedRateOverride || 0.04))`
       `monthlyResidualPerMonth = calculateReferralCommission(monthlyYield)` (5% of monthly yield)
       `monthlyResidualCommissionInr += (inv.paidMonths?.length || 0) * monthlyResidualPerMonth`
     - Total commission for `ru`:
       `totalCommissionInr = upfrontCommissionInr + monthlyResidualCommissionInr`
       `totalCommissionUsd = upfrontCommissionUsd + monthlyResidualCommissionUsd`
3. **Aggregates for the Referrer**:
   - `totalUpfrontEarnedInr` & `totalUpfrontEarnedUsd` (sum of L1 upfront commissions).
   - `totalResidualEarnedInr` & `totalResidualEarnedUsd` (sum of L2 monthly residual commissions).
   - `totalEarned` = sum of all `referral_bonus` transactions.

---

### 2.2 Dashboard UI Enhancements (`app/dashboard/referrals/page.js`)
1. **Tier Breakdown Cards (Requirement R3.1)**:
   - Introduce a 2-column or 2-row visual section above the table:
     - **Card A (Level 1 — Upfront 5% Bonus)**:
       - Icon: `Gift` / `Zap`
       - Tag: `Direct Commission`
       - Value: `5% Instant`
       - Subtitle: "Credited immediately when your referral's investment is activated."
       - Lifetime Upfront Earnings: `₹{totalUpfrontEarnedInr.toLocaleString('en-IN')}`
     - **Card B (Level 2 — Ongoing 5% Monthly Residual)**:
       - Icon: `TrendingUp` / `Repeat`
       - Tag: `Monthly Residual`
       - Value: `5% Monthly ROI`
       - Subtitle: "Credited on the 1st of every month when your referral receives their interest payout."
       - Lifetime Residual Earnings: `₹{totalResidualEarnedInr.toLocaleString('en-IN')}`
2. **Worked Example / Explainer Tooltip Banner (Requirement R3.3)**:
   - Distinct, elegant informational banner with a calculator/lightbulb accent:
     > **💡 Two-Tier Referral Example**:
     > If your referral invests **₹1,00,000** in the Limited Offer plan (6% monthly payout = ₹6,000/mo):
     > - **Upfront Bonus (5% of investment):** You earn **₹5,000** instantly upon activation.
     > - **Monthly Residual (5% of ROI):** You earn **₹300/month** for 6 months (**₹1,800** total residual).
     > - **Total Earnings:** **₹6,800** from a single investor!
3. **Referred Investors Table Breakdown (Requirement R3.2)**:
   - Replace 4-column layout with a 5-column breakdown:
     1. `Investor (Name & Email)`
     2. `Total Invested` (`₹...` / `$..`)
     3. `Upfront Bonus (5%)` (`₹...`)
     4. `Monthly Residual (5%)` (`₹... earned`)
     5. `Total Commission` (`₹...` highlighted in emerald/gold)
   - Remove hardcoded `isKuppusamy` checks.
4. **Transaction Feed Distinction**:
   - Display a pill badge next to each `referral_bonus` transaction in the history feed:
     - `Direct Bonus` (gold badge) if description includes "Direct" or "investment approval"
     - `Monthly Residual` (emerald/cyan badge) if description includes "Monthly Referral Commission"
5. **No Regressions Guarantee (Requirement R3.4)**:
   - Preserve referral link copy (`navigator.clipboard`), WhatsApp/Telegram sharing.
   - Preserve payout claim form, currency selector, bank account validation, and submission to `/api/referrals/claim`.
   - Preserve claims history table.

---

### 2.3 Test Infrastructure Architecture
1. **Test Runner Selection**:
   - Utilize Node 22's native `node:test` + `node:assert/strict` runner.
   - Zero external dependency bloat, fast startup (<50ms), native ESM support, co-locatable in `tests/`.
2. **Test Scripts to add to `package.json`**:
   - `"test": "node --test tests/**/*.test.mjs"`
   - `"test:referrals": "node --test tests/referral*.test.mjs"`
3. **Test Suites Inventory**:
   - `tests/referral-utils.test.mjs`: Tests `calculateReferralCommission` math, boundary values, zero/negative inputs, large amounts.
   - `tests/referral-calculations.test.mjs`: Tests 2-tier calculations: L1 (5% of 1,00,000 = 5,000), L2 (5% of 6,000 = 300/mo), combined (6,800 total).
   - `tests/referrals-api-contract.test.mjs`: Validates the response schema and data contract expected by `/dashboard/referrals`.
   - `tests/referral-idempotency.test.mjs`: Validates idempotency guarantees (no duplicate L1 credits on repeated activation, no duplicate L2 credits on repeated cron runs).

---

## 3. Caveats

1. **Transaction Description-Based Tagging**:
   - In legacy transactions, L1 descriptions were recorded as `"${referrerRate * 100}% Referral bonus from ${user.name}'s investment approval"`. New L1 descriptions are `"Direct Referral Bonus — ${user.name}"`. The UI and API parser should match both patterns when classifying historical transactions.
2. **Referrer Matching**:
   - In `app/api/referrals/route.js`, querying both `referredBy: user.email` and `referredBy: user.referralCode` guarantees all referred users are found regardless of registration format.
3. **Currency Conversion on Referral Balances**:
   - Referral payouts and earnings support both INR (`referralWalletInr`) and USD (`referralWallet`). If a referrer refers both USD and INR investors, each currency accumulates in its respective wallet.

---

## 4. Conclusion & Proposed Implementation Specs

### 4.1 Proposed `app/api/referrals/route.js` Implementation

```javascript
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Investment from '@/models/Investment';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';
import { calculateReferralCommission } from '@/lib/referralUtils';

export async function GET(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await connectToDatabase();

        const user = await User.findById(payload.userId).select('email referralCode limitedRateOverride');
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Find all users referred by this user (by email or referralCode)
        const referrerIdentifiers = [user.email];
        if (user.referralCode) referrerIdentifiers.push(user.referralCode);

        const referredUsers = await User.find({ referredBy: { $in: referrerIdentifiers } })
            .select('name email limitedRateOverride createdAt')
            .sort({ createdAt: -1 })
            .lean();

        // Calculate commissions & investments dynamically for each referred user
        const enrichedReferredUsers = [];
        const commissionRate = user.limitedRateOverride !== undefined && user.limitedRateOverride !== null
            ? user.limitedRateOverride
            : 0.05;
        const commissionPct = commissionRate * 100;

        let totalUpfrontEarnedInr = 0;
        let totalUpfrontEarnedUsd = 0;
        let totalResidualEarnedInr = 0;
        let totalResidualEarnedUsd = 0;

        for (const ru of referredUsers) {
            const investments = await Investment.find({ userId: ru._id, status: { $in: ['active', 'completed'] } });

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

                    // Calculate cumulative L2 monthly residual commission for limited_inr
                    if (inv.schemeType === 'limited_inr' && inv.paidMonths && inv.paidMonths.length > 0) {
                        const investorRate = ru.limitedRateOverride !== undefined && ru.limitedRateOverride !== null
                            ? ru.limitedRateOverride
                            : 0.04;
                        const monthlyYield = Math.round(inv.amount * (investorRate > 1 ? investorRate / 100 : investorRate));
                        const residualPerMonth = calculateReferralCommission(monthlyYield);
                        monthlyResidualCommissionInr += (inv.paidMonths.length * residualPerMonth);
                    }
                }
            }

            // Upfront L1 Commission (5% or referrer override)
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

            enrichedReferredUsers.push({
                ...ru,
                totalInvestedInr,
                totalInvestedUsd,
                commissionPct,
                upfrontCommissionInr,
                upfrontCommissionUsd,
                monthlyResidualCommissionInr,
                monthlyResidualCommissionUsd,
                totalCommissionInr,
                totalCommissionUsd,
                // Backward compatibility:
                commissionAmountInr: upfrontCommissionInr,
                commissionAmountUsd: upfrontCommissionUsd
            });
        }

        // Find all referral bonus transactions for this user
        const referralTxs = await Transaction.find({
            userId: payload.userId,
            type: 'referral_bonus'
        }).sort({ createdAt: -1 });

        const totalEarned = referralTxs.reduce((acc, t) => acc + t.amount, 0);

        return NextResponse.json({
            referralCode: user.referralCode,
            referredUsers: enrichedReferredUsers,
            referralTxs,
            totalEarned,
            totalUpfrontEarnedInr,
            totalUpfrontEarnedUsd,
            totalResidualEarnedInr,
            totalResidualEarnedUsd
        }, { status: 200 });

    } catch (error) {
        console.error('Referrals API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
```

---

### 4.2 Proposed UI Updates for `app/dashboard/referrals/page.js`

1. **Two-Tier Visual Breakdown Cards & Worked Example Snippet**:

```jsx
{/* Two-Tier Referral Program Overview */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
    {/* Tier 1: Upfront Direct Bonus */}
    <div className="bg-[#0A0A0A] border border-[#d4af35]/30 p-6 rounded-3xl relative overflow-hidden shadow-lg group hover:border-[#d4af35]/50 transition-all">
        <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d4af35]/10 border border-[#d4af35]/30 flex items-center justify-center text-[#d4af35]">
                <Gift className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-[#d4af35]/10 border border-[#d4af35]/30 text-[#d4af35]">
                Level 1 · Instant
            </span>
        </div>
        <h3 className="text-lg font-black text-white mb-1">Upfront 5% Referral Bonus</h3>
        <p className="text-xs text-[#d4af35]/70 font-medium mb-4">
            Earn 5% instantly on the capital amount whenever your referred investor activates an investment.
        </p>
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Upfront Earned</span>
            <span className="text-sm font-black text-emerald-400 font-mono">₹{(totalUpfrontEarnedInr || 0).toLocaleString('en-IN')}</span>
        </div>
    </div>

    {/* Tier 2: Monthly Residual Commission */}
    <div className="bg-[#0A0A0A] border border-cyan-500/30 p-6 rounded-3xl relative overflow-hidden shadow-lg group hover:border-cyan-500/50 transition-all">
        <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                Level 2 · Recurring
            </span>
        </div>
        <h3 className="text-lg font-black text-white mb-1">Ongoing 5% Monthly Residual</h3>
        <p className="text-xs text-slate-400 font-medium mb-4">
            Earn 5% recurring commission every month on each monthly ROI payout received by your referral.
        </p>
        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Residual Earned</span>
            <span className="text-sm font-black text-cyan-400 font-mono">₹{(totalResidualEarnedInr || 0).toLocaleString('en-IN')}</span>
        </div>
    </div>
</div>

{/* Worked Example Banner */}
<div className="bg-gradient-to-r from-[#171305] via-[#0A0A0A] to-[#051317] border border-[#d4af35]/30 p-6 rounded-3xl relative overflow-hidden shadow-xl">
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#d4af35]/20 border border-[#d4af35]/40 flex items-center justify-center text-[#d4af35] shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
        </div>
        <div className="space-y-2">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
                How It Works: Real-World Earning Example
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                If your referral invests <strong className="text-white font-black">₹1,00,000</strong> in the Limited Offer plan (yielding 6%/month = ₹6,000/mo for 6 months):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#d4af35]">1. Upfront Bonus (5%)</span>
                    <p className="text-base font-black text-white mt-0.5">₹5,000</p>
                    <span className="text-[9px] text-slate-400 font-medium">Instant upon activation</span>
                </div>
                <div className="bg-black/50 border border-white/10 p-3 rounded-xl">
                    <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400">2. Monthly Residual (5%)</span>
                    <p className="text-base font-black text-white mt-0.5">₹300 / mo</p>
                    <span className="text-[9px] text-slate-400 font-medium">₹1,800 over 6 months</span>
                </div>
                <div className="bg-black/50 border border-[#d4af35]/40 p-3 rounded-xl bg-[#d4af35]/5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Total Referral Income</span>
                    <p className="text-base font-black text-emerald-400 mt-0.5">₹6,800</p>
                    <span className="text-[9px] text-slate-400 font-medium">From one single referral</span>
                </div>
            </div>
        </div>
    </div>
</div>
```

2. **Referred Investors Table Columns & Structure**:

```jsx
<table className="w-full text-left whitespace-nowrap">
    <thead className="bg-[#080808] border-b border-[#d4af35]/10">
        <tr>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Name &amp; Email</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Total Invested</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Upfront Bonus (5%)</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Monthly Residual (5%)</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[#d4af35]/60">Total Earned</th>
        </tr>
    </thead>
    <tbody className="divide-y divide-[#d4af35]/5">
        {referredUsers.map((u) => {
            const totalInr = u.totalInvestedInr || 0;
            const totalUsd = u.totalInvestedUsd || 0;
            const upfrontInr = u.upfrontCommissionInr ?? u.commissionAmountInr ?? 0;
            const upfrontUsd = u.upfrontCommissionUsd ?? u.commissionAmountUsd ?? 0;
            const residualInr = u.monthlyResidualCommissionInr || 0;
            const residualUsd = u.monthlyResidualCommissionUsd || 0;
            const totalEarnedInr = u.totalCommissionInr ?? (upfrontInr + residualInr);
            const totalEarnedUsd = u.totalCommissionUsd ?? (upfrontUsd + residualUsd);

            const showInr = totalInr > 0 || (totalInr === 0 && totalUsd === 0);
            const showUsd = totalUsd > 0;

            return (
                <tr key={u._id} className="hover:bg-[#d4af35]/3 transition-colors">
                    <td className="px-6 py-4">
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-xs font-semibold text-slate-400 mt-0.5">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-white text-sm">
                        {showInr && <div>₹{totalInr.toLocaleString('en-IN')}</div>}
                        {showUsd && <div>${totalUsd.toLocaleString('en-US')} USD</div>}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-amber-400 text-sm">
                        {showInr && <div>₹{upfrontInr.toLocaleString('en-IN')}</div>}
                        {showUsd && <div>${upfrontUsd.toLocaleString('en-US')} USD</div>}
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-cyan-400 text-sm">
                        {showInr && <div>₹{residualInr.toLocaleString('en-IN')}</div>}
                        {showUsd && <div>${residualUsd.toLocaleString('en-US')} USD</div>}
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-emerald-400 text-sm">
                        {showInr && <div>₹{totalEarnedInr.toLocaleString('en-IN')}</div>}
                        {showUsd && <div>${totalEarnedUsd.toLocaleString('en-US')} USD</div>}
                    </td>
                </tr>
            );
        })}
    </tbody>
</table>
```

---

## 5. Verification Method

### 5.1 Verification Commands
1. **Inspect API Route**:
   ```bash
   grep -n "upfrontCommissionInr" app/api/referrals/route.js
   grep -n "monthlyResidualCommissionInr" app/api/referrals/route.js
   ```
2. **Inspect Dashboard UI**:
   ```bash
   grep -n "Monthly Residual" app/dashboard/referrals/page.js
   grep -n "Upfront 5% Referral Bonus" app/dashboard/referrals/page.js
   ```
3. **Execute Test Suite**:
   ```bash
   npm test
   ```
4. **Compile & Build Application**:
   ```bash
   npm run build
   ```

### 5.2 Invalidation Conditions
- Missing `monthlyResidualCommissionInr` computation in `/api/referrals` leaves the dashboard table residual column empty (0).
- Failing to preserve `navigator.clipboard` or claim form state regressions in `/dashboard/referrals`.
- Compiling errors in JSX/Tailwind classes during `npm run build`.
