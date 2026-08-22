# Plan: Two-Tier Referral Commission System

## Objective
Implement a robust, idempotent two-tier referral commission system for Hashprime (Next.js 14 App Router + MongoDB):
- Level 1: One-time 5% direct commission on initial investment activation
- Level 2: Recurring 5% monthly residual commission on referred investor's monthly ROI payout in `processInterestPayments()`
- UI: `/dashboard/referrals` breakdown of both streams, detailed table, and worked example
- E2E Tests: Full test coverage, idempotency checks, and adversarial verification

## Phases & Execution Steps

### Phase 0: Survey & Discovery (3 Parallel Explorers)
- **Explorer 1 (Models & L1 Activation)**: Explore `models/User.js`, `models/Investment.js`, `models/Transaction.js`, `lib/referralUtils.js`, and investment creation/activation routes (e.g. `app/api/admin/investments/`, `app/api/user/investments/`, payment webhooks/approvals).
- **Explorer 2 (Cron & L2 Recurring Monthly Commission)**: Explore `lib/cron.js`, `processInterestPayments()`, monthly interest computation logic, `paidMonths` tracking, and transaction records.
- **Explorer 3 (APIs & Referral Dashboard UI)**: Explore `app/api/referrals/route.js`, `app/dashboard/referrals/page.js`, and relevant components/styles/tests.

### Phase 1: Architecture & PROJECT.md / TEST_INFRA.md Setup
- Synthesize findings into `PROJECT.md` (Feature Inventory, Architecture, Code Layout, Interfaces).
- Set up `TEST_INFRA.md` for requirement-driven E2E tests.

### Phase 2: Dual Track Execution
- **Implementation Track**:
  - Milestone 1: L1 Direct Commission & Idempotency
  - Milestone 2: L2 Monthly Residual Commission in `lib/cron.js`
  - Milestone 3: Referral APIs & Frontend Dashboard UI
- **E2E Testing Track**:
  - Test Harness & Tiers 1-4 Test Suites (Feature, Boundary, Combinations, Real-World Scenarios) -> `TEST_READY.md`

### Phase 3: Verification, Hardening & Gate
- Implementation Final Milestone: Run 100% E2E tests.
- Adversarial Hardening (Tier 5): Challengers find gaps/edge cases.
- Reviewers (2) + Forensic Auditor (Integrity Forensics) + Challengers (2).
- Gate status validation in `GATE_STATUS.md`.

### Phase 4: Final Synthesis & Human Reporting
- Synthesize all results, write `handoff.md`, and report to parent/user.
