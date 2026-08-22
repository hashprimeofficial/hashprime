# Handoff Report: Explorer 2 (Cron & L2 Recurring Monthly Commission)

## 1. Observation

### 1.1 Codebase Structure & Key Files Inspected
1. **`lib/cron.js`** (Lines 1–235)
   - `processInterestPayments()` (Lines 17–97):
     - Line 20–23: Queries active `limited_inr` investments (`Investment.find({ status: 'active', schemeType: 'limited_inr' })`).
     - Line 28–31: Guards against execution on days other than the 1st of the month (`today.getDate() !== 1`).
     - Line 34: Fetches the investor `User.findById(inv.userId)`.
     - Line 38–42: Computes `startDate` using `inv.createdAt` (does not check `inv.investmentDate`).
     - Line 45–49: Calculates `monthlyRate` (default 0.04 or `user.limitedRateOverride`) and `monthlyYield = Math.round(inv.amount * monthlyRate)`.
     - Line 54–62: Iterates `m` from 1 to 6, computes anniversary `payoutDate.setMonth(payoutDate.getMonth() + m)`, and checks `if (today >= payoutDate)`.
     - Line 64–72: Performs atomic MongoDB check-and-push:
       ```javascript
       const transitioning = await Investment.findOneAndUpdate(
           { _id: inv._id, paidMonths: { $ne: m } },
           { $push: { paidMonths: m } },
           { new: true }
       );
       if (!transitioning) continue;
       ```
     - Line 75–77: Increments `user.inrWallet` with `$inc: { inrWallet: monthlyYield }`.
     - Line 80–86: Creates `Transaction` record for investor (`type: 'investment'`, `amount: monthlyYield`, `currency: 'INR'`, `description: monthNames[m - 1]`).
     - **Currently missing**: No referral commission logic exists in `processInterestPayments()`.
   - `processMaturedInvestments()` (Lines 99–210):
     - Line 103–106: Finds active investments past maturity (`maturesAt: { $lte: new Date() }`).
     - Line 118–122: Atomically marks investment as `completed`.
     - Line 138–177: For `limited_inr`, forces payout of any unpaid months in `1..6` by creating `Transaction` records and updating `user.inrWallet`.
     - **Currently missing**: No referral commission logic for force-paid unpaid months at maturity.
   - `initCron()` (Lines 212–234):
     - Runs hourly (`0 * * * *`) via `node-cron` and invokes `processInterestPayments()` and `processMaturedInvestments()`.

2. **`app/api/admin/investments/monthly-payout/route.js`** (Lines 1–134)
   - Admin UI endpoint for manual monthly payout triggering (`POST /api/admin/investments/monthly-payout`).
   - Line 31–35: Finds active `limited_inr` investments.
   - Line 50–52: Resolves start date using `investment.investmentDate || investment.createdAt`.
   - Line 84–98: Atomically locks month via `Investment.findOneAndUpdate({ _id: investment._id, status: 'active', paidMonths: { $ne: currentMonthNumber } }, { $push: { paidMonths: currentMonthNumber } })`.
   - Line 101–112: Updates `user.inrWallet` and creates `Transaction`.
   - **Currently missing**: Does not credit L2 referral bonus to referrers when admin triggers manual payout.

3. **`lib/referralUtils.js`** (Lines 1–14)
   - `calculateReferralCommission(amount)` computes `Math.round(amount * 0.05)`.

4. **`models/User.js`** (Lines 1–90)
   - Line 26–29: `referredBy: { type: String, default: '' }` (stores referrer's email, ObjectId, or referralCode).
   - Line 42–45: `referralWalletInr: { type: Number, default: 0 }` (stores INR referral balances).
   - Line 38–41: `referralWallet: { type: Number, default: 0 }` (stores USD referral balances).
   - Line 80: `limitedRateOverride: { type: Number, default: null }`.

5. **`models/Investment.js`** (Lines 1–55)
   - Line 22: `schemeType` includes `'limited_inr'`.
   - Line 42–45: `investmentDate: { type: Date, required: false }`.
   - Line 46–49: `paidMonths: { type: [Number], default: [] }`.

6. **`models/Transaction.js`** (Lines 1–38)
   - Line 12: `type` enum includes `'referral_bonus'`.
   - Line 21: `currency` enum: `['INR', 'USDT']`.

7. **`app/api/referrals/route.js`** (Lines 1–86)
   - Line 23: `User.find({ referredBy: user.email })`.
   - Line 67–70: `Transaction.find({ userId: payload.userId, type: 'referral_bonus' })`.

---

## 2. Logic Chain

1. **Eligible Investments & Payout Schedule (Observation 1.1)**:
   - Monthly interest payouts only apply to scheme `limited_inr` (a 6-month holding plan).
   - Each month `m` from 1 to 6 has an anniversary payout date `startDate + m months`.
   - On the 1st of each month (or when `today >= payoutDate`), month `m` becomes eligible if `m` is not in `paidMonths`.

2. **Idempotency Guarantee via MongoDB Atomic Operator (Observation 1.1, 1.2)**:
   - The query `{ _id: inv._id, paidMonths: { $ne: m } }` combined with update `{ $push: { paidMonths: m } }` acts as a distributed atomic lock.
   - If multiple cron executions or concurrent requests fire simultaneously, exactly ONE execution acquires the lock. All subsequent or duplicate executions fail the condition and are skipped (`transitioning === null`).
   - Consequently, executing `processInterestPayments()` 24 times on the 1st of the month will only execute payout and referral commission exactly ONCE per `(investment, month)` pair.

3. **Referrer Lookup & L2 Commission Calculation (Observation 1.1, 1.3, 1.4)**:
   - When an investor `user` receives `monthlyYield` for month `m`:
     - If `user.referredBy` is present, look up the referrer via `User.findOne({ email: user.referredBy })`, with fallback to `findById` (if valid ObjectId) and `findOne({ referralCode: user.referredBy })`.
     - Exclude self-referrals (`!referrer._id.equals(user._id)`).
     - Calculate L2 recurring commission: `calculateReferralCommission(monthlyYield)` which is `Math.round(monthlyYield * 0.05)`.
     - For standard 4% return on ₹1,00,000: `monthlyYield = 4,000` -> `commission = 5% of 4,000 = ₹200`.
     - For 6% return on ₹1,00,000: `monthlyYield = 6,000` -> `commission = 5% of 6,000 = ₹300` (matches requirement R3 example).
     - For 5% return on ₹5,00,000: `monthlyYield = 25,000` -> `commission = 5% of 25,000 = ₹1,250`.

4. **Balance & Ledger Synchronization (Observation 1.4, 1.6)**:
   - Atomically increment referrer's wallet: `User.findByIdAndUpdate(referrer._id, { $inc: { referralWalletInr: referralCommission } })`.
   - Create Transaction:
     - `userId`: `referrer._id`
     - `type`: `'referral_bonus'`
     - `amount`: `referralCommission`
     - `currency`: `'INR'`
     - `description`: `` `Monthly Referral Commission — ${user.name} Month ${m}` ``

5. **Start Date Edge Case & Consistency (Observation 1.1, 1.2, 1.5)**:
   - `lib/cron.js` currently uses `inv.createdAt` without checking `inv.investmentDate`.
   - Setting `startDate = inv.investmentDate ? new Date(inv.investmentDate) : (inv.createdAt ? new Date(inv.createdAt) : ...)` fixes parity between admin payouts, manual date adjustments, and automated cron runs.

6. **Completeness across Payout Trigger Points (Observation 1.1, 1.2)**:
   - To prevent referrers from missing commissions if payouts occur outside the standard cron loop, the same L2 commission credit logic must also be present in:
     - `processInterestPayments()` in `lib/cron.js` (primary cron).
     - `processMaturedInvestments()` in `lib/cron.js` (for any remaining unpaid months force-paid at maturity).
     - `POST /api/admin/investments/monthly-payout` in `app/api/admin/investments/monthly-payout/route.js` (admin manual trigger).

---

## 3. Caveats

1. **Non-INR Schemes**:
   - Only `limited_inr` has monthly recurring interest payments. USD schemes (`3m_usd`, `6m_usd`, `1y_usd`, `5y_usd`) and other INR schemes (`3m_inr`, `6m_inr`, `1y_inr`, `5y_inr`) are term-end maturity schemes and do not have monthly interest cycles.
2. **MongoDB Transactions vs Single Document Atomicity**:
   - The codebase does not use replica set multi-document transactions (`session.startTransaction()`). Instead, it relies on atomic single-document updates (`findOneAndUpdate` and `$inc`). If a server process crashes precisely between updating `Investment.paidMonths` and updating `User.referralWalletInr`, a reconciliation script would be needed. However, the atomic gate on `paidMonths` ensures no double payments ever occur.
3. **Referrer Override vs Direct 5% Rate**:
   - The requirement specifies a strict 5% of monthly ROI for L2 residual commission (`calculateReferralCommission(monthlyYield)`). We assume L2 commission is always 5% of the investor's monthly payout amount.

---

## 4. Conclusion & Concrete Proposed Implementation

### 4.1 Proposed Implementation for `lib/cron.js` (`processInterestPayments`)

```javascript
import { calculateReferralCommission } from './referralUtils';

export async function processInterestPayments() {
    try {
        await connectToDatabase();
        const activeInvestments = await Investment.find({
            status: 'active',
            schemeType: 'limited_inr'
        });

        const today = new Date();

        // Interest payouts strictly trigger on scheduled payout dates (e.g. 1st of the month)
        if (today.getDate() !== 1) {
            console.log('[Cron] Skipping interest payout processing: Not a scheduled payout date (1st of the month).');
            return;
        }

        for (const inv of activeInvestments) {
            const user = await User.findById(inv.userId);
            if (!user) continue;

            // Calculate investment start date (use investmentDate, fallback to createdAt, then maturesAt - 6 months)
            const startDate = inv.investmentDate
                ? new Date(inv.investmentDate)
                : (inv.createdAt ? new Date(inv.createdAt) : (() => {
                    const d = new Date(inv.maturesAt);
                    d.setMonth(d.getMonth() - 6);
                    return d;
                })());

            // Get monthly rate (override or default 4%)
            const rate = user.limitedRateOverride !== null && user.limitedRateOverride !== undefined
                ? user.limitedRateOverride
                : 0.04;
            const monthlyRate = rate > 1 ? rate / 100 : rate;
            const monthlyYield = Math.round(inv.amount * monthlyRate);

            let updatedPaidMonths = [...(inv.paidMonths || [])];

            // Check each month from 1 to 6
            for (let m = 1; m <= 6; m++) {
                if (updatedPaidMonths.includes(m)) continue;

                // Calculate exact payout anniversary date for month m
                const payoutDate = new Date(startDate);
                payoutDate.setMonth(payoutDate.getMonth() + m);

                // If today is on or after the payout date, credit it!
                if (today >= payoutDate) {
                    // 1. Atomic lock: mark month as paid first to prevent duplicate payouts from race conditions
                    const transitioning = await Investment.findOneAndUpdate(
                        { _id: inv._id, paidMonths: { $ne: m } },
                        { $push: { paidMonths: m } },
                        { new: true }
                    );

                    if (!transitioning) {
                        continue; // Already processed by a concurrent run
                    }

                    // 2. Increment User's INR Wallet atomically
                    await User.findByIdAndUpdate(user._id, {
                        $inc: { inrWallet: monthlyYield }
                    });

                    // 3. Create transaction record for the investor
                    await Transaction.create({
                        userId: user._id,
                        type: 'investment',
                        amount: monthlyYield,
                        currency: 'INR',
                        description: monthNames[m - 1]
                    });

                    // 4. Mark month as paid locally
                    updatedPaidMonths.push(m);
                    console.log(`[Cron] Credited ${monthNames[m - 1]} of ₹${monthlyYield} to user ${user.email} for investment ${inv._id}`);

                    // 5. Level 2 — Recurring Monthly Commission (5% of investor's monthly ROI)
                    if (user.referredBy && monthlyYield > 0) {
                        try {
                            let referrer = await User.findOne({ email: user.referredBy });
                            if (!referrer && mongoose.isValidObjectId(user.referredBy)) {
                                referrer = await User.findById(user.referredBy);
                            }
                            if (!referrer && user.referredBy) {
                                referrer = await User.findOne({ referralCode: user.referredBy });
                            }

                            if (referrer && !referrer._id.equals(user._id)) {
                                const referralCommission = calculateReferralCommission(monthlyYield);

                                if (referralCommission > 0) {
                                    await User.findByIdAndUpdate(referrer._id, {
                                        $inc: { referralWalletInr: referralCommission }
                                    });

                                    await Transaction.create({
                                        userId: referrer._id,
                                        type: 'referral_bonus',
                                        amount: referralCommission,
                                        currency: 'INR',
                                        description: `Monthly Referral Commission — ${user.name} Month ${m}`
                                    });

                                    console.log(`[Cron] Credited L2 referral commission of ₹${referralCommission} to referrer ${referrer.email} for ${user.name} Month ${m}`);
                                }
                            }
                        } catch (refErr) {
                            console.error(`[Cron] Error crediting L2 referral commission for user ${user.email} (inv ${inv._id}, month ${m}):`, refErr);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('[Cron] Error processing interest payments:', error);
    }
}
```

### 4.2 Proposed Implementation for `lib/cron.js` (`processMaturedInvestments` force-pay section)

```javascript
                let forcePayYieldTotal = 0;
                for (let m = 1; m <= 6; m++) {
                    if (updatedPaidMonths.includes(m)) continue;
                    // Force pay this month
                    await Transaction.create({
                        userId: user._id,
                        type: 'investment',
                        amount: monthlyYield,
                        currency: 'INR',
                        description: monthNames[m - 1]
                    });
                    forcePayYieldTotal += monthlyYield;
                    updatedPaidMonths.push(m);
                    console.log(`[Cron] Force paid ${monthNames[m - 1]} of ₹${monthlyYield} during maturity process for user ${user.email}.`);

                    // L2 Recurring Referral Commission for force-paid month
                    if (user.referredBy && monthlyYield > 0) {
                        try {
                            let referrer = await User.findOne({ email: user.referredBy });
                            if (!referrer && mongoose.isValidObjectId(user.referredBy)) {
                                referrer = await User.findById(user.referredBy);
                            }
                            if (!referrer && user.referredBy) {
                                referrer = await User.findOne({ referralCode: user.referredBy });
                            }

                            if (referrer && !referrer._id.equals(user._id)) {
                                const referralCommission = calculateReferralCommission(monthlyYield);
                                if (referralCommission > 0) {
                                    await User.findByIdAndUpdate(referrer._id, {
                                        $inc: { referralWalletInr: referralCommission }
                                    });
                                    await Transaction.create({
                                        userId: referrer._id,
                                        type: 'referral_bonus',
                                        amount: referralCommission,
                                        currency: 'INR',
                                        description: `Monthly Referral Commission — ${user.name} Month ${m}`
                                    });
                                    console.log(`[Cron] Force credited L2 referral commission of ₹${referralCommission} to referrer ${referrer.email} for ${user.name} Month ${m} at maturity.`);
                                }
                            }
                        } catch (refErr) {
                            console.error(`[Cron] Error force-crediting L2 referral commission for user ${user.email} (month ${m}):`, refErr);
                        }
                    }
                }
```

### 4.3 Proposed Implementation for `app/api/admin/investments/monthly-payout/route.js`

```javascript
import { calculateReferralCommission } from '@/lib/referralUtils';

// Inside POST loop, after crediting investor:
const user = await User.findById(investment.userId);
if (user && user.referredBy && monthlyPayout > 0) {
    try {
        let referrer = await User.findOne({ email: user.referredBy });
        if (!referrer && mongoose.isValidObjectId(user.referredBy)) {
            referrer = await User.findById(user.referredBy);
        }
        if (!referrer && user.referredBy) {
            referrer = await User.findOne({ referralCode: user.referredBy });
        }

        if (referrer && !referrer._id.equals(user._id)) {
            const referralCommission = calculateReferralCommission(monthlyPayout);

            if (referralCommission > 0) {
                await User.findByIdAndUpdate(referrer._id, {
                    $inc: { referralWalletInr: referralCommission }
                });

                await Transaction.create({
                    userId: referrer._id,
                    type: 'referral_bonus',
                    amount: referralCommission,
                    currency: 'INR',
                    description: `Monthly Referral Commission — ${user.name} Month ${currentMonthNumber}`
                });
            }
        }
    } catch (refErr) {
        console.error('Error crediting L2 referral commission in manual monthly-payout:', refErr);
    }
}
```

---

## 5. Verification Method

### 5.1 Automated Script Verification
To verify the implementation once coded, create and run an isolated Node.js test script (or Jest/Mocha if configured) against a test/in-memory MongoDB database or mock DB:
1. **Setup**:
   - Create Referrer User (A) with initial `referralWalletInr: 0`.
   - Create Investor User (B) with `referredBy: "referrer@example.com"` and initial `inrWallet: 0`.
   - Create Active Investment for B with `schemeType: 'limited_inr'`, `amount: 100000`, `paidMonths: []`, `createdAt: 1 month ago`.
2. **Execute**:
   - Call `processInterestPayments()`.
3. **Assertions**:
   - `Investment.paidMonths` contains `[1]`.
   - Investor B's `inrWallet` is `4000` (4% of 100k).
   - Investor B has 1 `Transaction` of `type: 'investment'` with amount `4000`.
   - Referrer A's `referralWalletInr` is `200` (5% of 4,000).
   - Referrer A has 1 `Transaction` of `type: 'referral_bonus'`, amount `200`, description: `"Monthly Referral Commission — [User B Name] Month 1"`.
4. **Idempotency Check**:
   - Call `processInterestPayments()` a second time.
   - Assert `Investment.paidMonths` is still `[1]`.
   - Assert Investor B's `inrWallet` remains `4000` (no change).
   - Assert Referrer A's `referralWalletInr` remains `200` (no change).
   - Assert no additional transactions were created.

### 5.2 Invalidation Conditions
- Any changes that omit `paidMonths: { $ne: m }` from the atomic update will invalidate concurrency safety.
- Failing to import `calculateReferralCommission` from `@/lib/referralUtils` in `lib/cron.js` will cause a runtime exception.
- Storing commission in `referralWallet` (USD) instead of `referralWalletInr` (INR) for INR investments will break wallet reconciliation.
