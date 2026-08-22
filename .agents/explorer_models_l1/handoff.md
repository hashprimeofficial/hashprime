# Investigation & Analysis Handoff Report: Models, Investment Activation & L1 Referral Commission

## 1. Observation

### 1.1 Data Models & Schemas

#### A. `models/User.js` (Lines 1-90)
- **Referral & Wallet Fields**:
  - Line 26-29: `referredBy: { type: String, default: "" }` — Stores the referrer identifier (email address established at registration).
  - Line 30-37: `usdWallet: { type: Number, default: 0 }`, `inrWallet: { type: Number, default: 0 }` — Principal and interest wallets.
  - Line 38-45: `referralWallet: { type: Number, default: 0 }` (USD referral earnings), `referralWalletInr: { type: Number, default: 0 }` (INR referral earnings).
  - Line 79: `referralCode: { type: String, unique: true, sparse: true, default: null }` — Unique 6-character referral code generated upon email verification (`app/api/auth/verify-email/route.js:49`).
  - Line 80: `limitedRateOverride: { type: Number, default: null }` — Custom rate override used for commission or monthly return calculations.

#### B. `models/Investment.js` (Lines 1-55)
- **Fields**:
  - Line 5-9: `userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }`
  - Line 10-13: `amount: { type: Number, required: true }`
  - Line 14-19: `currency: { type: String, enum: ["USD", "INR"], required: true, default: "INR" }`
  - Line 20-24: `schemeType: { type: String, enum: ["3m_inr", "6m_inr", "1y_inr", "5y_inr", "3m_usd", "6m_usd", "1y_usd", "5y_usd", "limited_inr"], required: true }`
  - Line 33-37: `status: { type: String, enum: ["pending", "active", "completed"], default: "pending" }`
  - Line 38-41: `maturesAt: { type: Date, required: true }`
  - Line 42-45: `investmentDate: { type: Date, required: false }`
  - Line 46-49: `paidMonths: { type: [Number], default: [] }`
- **Missing Fields**:
  - No `directReferralPaid: Boolean` or `referralCommissionPaid: Boolean` field exists to explicitly guard against re-crediting direct commission if status transitions occur multiple times.

#### C. `models/Transaction.js` (Lines 1-38)
- **Fields**:
  - Line 5-9: `userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }`
  - Line 10-14: `type: { type: String, enum: ["investment", "referral_bonus", "withdrawal", "deposit"], required: true }`
  - Line 15-18: `amount: { type: Number, required: true }`
  - Line 19-23: `currency: { type: String, enum: ["INR", "USDT"], required: true }`
  - Line 24-26: `description: { type: String }`
- **Schema Inconsistencies**:
  - Currency enum specifies `["INR", "USDT"]`, whereas `Investment.js` uses `["USD", "INR"]`, and investment activation routes pass `"USD"` directly into `Transaction.create`.
  - In `app/api/admin/referral-claims/[id]/approve/route.js:39`, `type: "payout"` is created, which is outside the defined `type` enum.

#### D. `lib/referralUtils.js` (Lines 1-14)
- Line 10-13:
```javascript
export function calculateReferralCommission(amount) {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    return Math.round(amount * 0.05);
}
```
- Computes standard 5% commission rounded to the nearest integer.

---

### 1.2 Investment Lifecycle Routes & Commission Logic

#### A. User Investment Submission (`app/api/invest/route.js`)
- **Route**: `POST /api/invest`
- **Behavior**:
  - Validates user KYC (`user.kycStatus === "approved"`), OTP verification (2FA or email OTP), and scheme validity.
  - Checks if user wallet balance (`usdWallet` or `inrWallet`) >= `amount`.
  - **Does NOT** deduct wallet balance (Lines 113-114).
  - Creates `Investment` with `status: "pending"` (Line 125).
  - **Does NOT** trigger any referral commission.

#### B. Admin Approval & Activation (`app/api/admin/investments/[id]/route.js`)
- **Route**: `PATCH /api/admin/investments/[id]`
- **Trigger**: `safeUpdate.status === "active" && currentInvestment.status === "pending"` (Line 43).
- **Execution Flow**:
  1. Atomic transition (Lines 44-48):
     ```javascript
     const transitioning = await Investment.findOneAndUpdate(
         { _id: id, status: "pending" },
         { status: "active" },
         { new: true }
     );
     ```
  2. Wallet balance check & deduction (Lines 56-69):
     Deducts `amountNeeded` from `user.usdWallet` or `user.inrWallet`.
  3. Investment ledger debit (Lines 72-78):
     Creates `Transaction` with `type: "investment"`, `amount: -amountNeeded`, `currency: currentInvestment.currency`, description: `Invested in ${currentInvestment.schemeType} scheme (Admin Approved)`.
  4. L1 Direct Referral Bonus Calculation & Crediting (Lines 81-109):
     ```javascript
     if (user.referredBy) {
         let referrer = await User.findOne({ email: user.referredBy });
         if (!referrer) {
             referrer = await User.findOne({ referralCode: user.referredBy });
         }
         if (referrer) {
             const referrerRate = referrer.limitedRateOverride !== undefined && referrer.limitedRateOverride !== null
                 ? referrer.limitedRateOverride
                 : 0.05;
             const commissionAmount = referrer.limitedRateOverride !== undefined && referrer.limitedRateOverride !== null
                 ? Math.round(amountNeeded * referrerRate)
                 : calculateReferralCommission(amountNeeded);

             const currency = currentInvestment.currency || "INR";
             const updateField = currency === "USD" ? "referralWallet" : "referralWalletInr";

             await User.findByIdAndUpdate(referrer._id, {
                 $inc: { [updateField]: commissionAmount }
             });

             await Transaction.create({
                 userId: referrer._id,
                 type: "referral_bonus",
                 amount: commissionAmount,
                 currency: currency,
                 description: `${referrerRate * 100}% Referral bonus from ${user.name}'s investment approval`
             });
         }
     }
     ```

#### C. Admin Direct Investment Creation (`app/api/admin/investments/route.js`)
- **Route**: `POST /api/admin/investments`
- **Execution Flow**:
  - Validates user email, approved KYC, and available wallet balance.
  - Deducts balance from user's wallet via `$inc`.
  - Creates `Investment` with `status: "active"` directly.
  - Records deduction `Transaction` with `type: "investment"`.
  - Executes identical L1 referral bonus crediting logic (Lines 116-145) to referrer's `referralWallet` (USD) or `referralWalletInr` (INR) with `type: "referral_bonus"`.

#### D. Referral Data & Dashboard Endpoints
- **`app/api/referrals/route.js`**:
  - Line 23: `const referredUsers = await User.find({ referredBy: user.email })`
  - Calculates direct commission per user on the fly: `calculateReferralCommission(totalInvestedInr)`.
  - Fetches all referral transactions: `Transaction.find({ userId: payload.userId, type: "referral_bonus" })`.
  - Computes `totalEarned = referralTxs.reduce((acc, t) => acc + t.amount, 0)`.
- **`app/dashboard/referrals/page.js`**:
  - Displays `referralWalletInr` and `referralWalletUsd` balances.
  - Displays table of referred investors and referral bonus transaction history.
  - Allows payout requests via `POST /api/referrals/claim`.

---

## 2. Logic Chain

1. **User Referral Binding**:
   - During signup (`app/api/auth/register/route.js:30-42`), the entered `referredBy` is resolved against `User.findOne({ email })`, `User.findById(id)`, and `User.findOne({ referralCode })`.
   - The verified referrer's **email** is stored in the new user's `referredBy` field (`app/api/auth/verify-email/route.js:55`).
   - When querying referrers, the codebase uses both `{ email: user.referredBy }` and fallback `{ referralCode: user.referredBy }`.

2. **Wallet Separation**:
   - The platform strictly separates investment capital from referral rewards:
     - Main balance: `inrWallet` (INR) and `usdWallet` (USD).
     - Referral balance: `referralWalletInr` (INR) and `referralWallet` (USD).
   - Direct L1 commissions earned from INR investments increment `referralWalletInr`.
   - Direct L1 commissions earned from USD investments increment `referralWallet`.

3. **Current L1 Activation & Idempotency**:
   - In `PATCH /api/admin/investments/[id]`, commission crediting is guarded by `safeUpdate.status === "active" && currentInvestment.status === "pending"` and an atomic `Investment.findOneAndUpdate({ _id: id, status: "pending" }, { status: "active" })`.
   - If called concurrently, only one request transitions the document from `pending` to `active`.
   - **However**, if an active investment is modified later (or if an admin flips status to `pending` and then re-approves to `active`), there is no persistent flag (e.g. `directReferralPaid`) on the `Investment` document to prevent re-crediting.
   - Adding `directReferralPaid: { type: Boolean, default: false }` ensures true idempotency across any status transitions or manual adjustments.

4. **Transaction Consistency**:
   - Direct referral commissions create a `Transaction` document with:
     - `type: "referral_bonus"`
     - `currency`: `"INR"` (for INR schemes) or `"USD"` / `"USDT"` (for USD schemes)
     - `amount`: Positive integer commission amount
     - `description`: Formatted string indicating direct referral bonus and referred user name.

---

## 3. Caveats

1. **Transaction Schema Currency Enum**: `models/Transaction.js` currently specifies `enum: ["INR", "USDT"]`. Some routes pass `"USD"` when recording transactions. While Mongoose model caching has a cache-invalidation snippet in `Transaction.js`, standardizing the enum to `["INR", "USD", "USDT"]` prevents validation exceptions.
2. **Referral Query Matching**: `app/api/referrals/route.js:23` queries `User.find({ referredBy: user.email })`. If any legacy users have `referredBy` set to the referrer's `referralCode` instead of email, they would be omitted unless queried with `{ $or: [{ referredBy: user.email }, { referredBy: user.referralCode }] }`.
3. **No Direct Reference in Transaction**: `Transaction` does not store an `investmentId` foreign key; referral transactions are identified by `type: "referral_bonus"` and the text in `description`.

---

## 4. Conclusion & Recommendations

### Core Findings
1. **Model Architecture**:
   - `models/User.js` already has both `referralWallet` (USD) and `referralWalletInr` (INR).
   - `models/Investment.js` contains `paidMonths: [Number]` for tracking monthly ROI payouts, but lacks a dedicated flag for L1 direct commission tracking.
   - `models/Transaction.js` has `type: "referral_bonus"`, which is actively queried by referral dashboard routes.

2. **L1 Commission Flow**:
   - L1 Direct Referral Bonus (5%) is triggered at investment activation time in `app/api/admin/investments/[id]/route.js` (admin approval) and `app/api/admin/investments/route.js` (admin direct creation).
   - It correctly credits 5% of the principal amount to the referrer's `referralWalletInr` (for INR investments) or `referralWallet` (for USD investments).

3. **Recommended Implementation Changes for L1 & Schemas**:
   - **Schema Update (`models/Investment.js`)**:
     Add `directReferralPaid: { type: Boolean, default: false }`.
   - **Schema Update (`models/Transaction.js`)**:
     Update `currency` enum to `["INR", "USD", "USDT"]` and `type` enum to include `"payout"` if used in referral claims.
   - **Idempotency Guard**:
     In `app/api/admin/investments/[id]/route.js` and `app/api/admin/investments/route.js`, check `if (!investment.directReferralPaid)` and set `directReferralPaid: true` when crediting the L1 bonus.
   - **Description Formatting**:
     Format description as `"Direct Referral Bonus — ${user.name}"` (or `"${referrerRate * 100}% Direct Referral Bonus — ${user.name}"`).
   - **Admin Transaction Allowed Accounts (`app/api/admin/users/[id]/transaction/route.js` & `app/api/admin/users/[id]/route.js`)**:
     Add `"referralWalletInr"` to `ALLOWED_ACCOUNTS` and `ALLOWED_FIELDS`.

---

## 5. Verification Method

To independently verify these findings:

1. **Verify Models & Enums**:
   ```bash
   grep -n "referralWallet" models/User.js
   grep -n "paidMonths" models/Investment.js
   grep -n "referral_bonus" models/Transaction.js
   ```

2. **Verify Activation Routes**:
   ```bash
   grep -n "calculateReferralCommission" app/api/admin/investments/[id]/route.js
   grep -n "calculateReferralCommission" app/api/admin/investments/route.js
   ```

3. **Verify Referral & Claim Endpoints**:
   ```bash
   grep -n "referralWalletInr" app/api/referrals/claim/route.js
   grep -n "referredBy" app/api/referrals/route.js
   ```

4. **Verify Application Build**:
   ```bash
   npm run build
   ```
