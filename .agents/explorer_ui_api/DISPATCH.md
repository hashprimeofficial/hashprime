## 2026-08-22T02:53:51Z
You are Explorer 3 (Referral APIs, Dashboard UI & Test Infrastructure).
Your working directory is: `/Users/mohammedarif/hashprime-main/.agents/explorer_ui_api`
Please read `/Users/mohammedarif/hashprime-main/.agents/ORIGINAL_REQUEST.md` first.

Your Mission:
1. Investigate `app/api/referrals/route.js`, `app/dashboard/referrals/page.js`, and any related referral components or endpoints (e.g. claim referral payout endpoints, user dashboard).
2. Trace how `app/api/referrals/route.js` queries referred users, transactions, and total earnings. Check what data is returned and whether it needs to differentiate L1 upfront bonus vs L2 monthly residual commissions per user or overall.
3. Trace how `app/dashboard/referrals/page.js` renders the referral statistics, referral link, referred investors table, claim form, and transaction history.
4. Determine UI updates required:
   - Visual breakdown section (Upfront 5% vs Ongoing 5% Monthly Residual)
   - Referred Investors table breakdown (one-time commission, cumulative monthly residual, total)
   - Worked example / explainer tooltip ("Example: If your referral invests ₹1,00,000 at 6%/month — you earn ₹5,000 upfront + ₹300/month ongoing.")
   - Ensuring no regressions on referral link copy, payout claims, etc.
5. Check existing test framework and tooling (`package.json`, test scripts, Jest/Mocha/Vitest, mongoose test helpers, etc.).
6. Write a comprehensive, structured handoff report to `/Users/mohammedarif/hashprime-main/.agents/explorer_ui_api/handoff.md`.
7. Notify the orchestrator when done via send_message.
