## 2026-08-22T02:53:51Z

Investigate lib/cron.js and specifically processInterestPayments() and processMaturedInvestments().
Trace how processInterestPayments() finds eligible investments, computes monthly interest payout for limited_inr (and other schemes if any), updates paidMonths, and creates Transaction records.
Trace how to look up the referrer for each eligible investment's user, and how to calculate 5% of the monthly payout amount.
Detail the exact balance update (referralWalletInr), transaction creation (type: 'referral_bonus', description: "Monthly Referral Commission — [referred user name] Month [N]"), and idempotency protection against duplicate execution of the cron.
Identify any potential race conditions, edge cases (e.g., deleted referrer, zero payout, multiple investments per user, multiple runs on the same day/month), and how paidMonths / transaction queries guarantee idempotency.
Write a comprehensive, structured handoff report to /Users/mohammedarif/hashprime-main/.agents/explorer_cron_l2/handoff.md. Include file paths, line numbers, code snippets, and recommendations.
Notify the orchestrator when done via send_message.
