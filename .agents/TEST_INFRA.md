# E2E Test Infra: Two-Tier Referral Commission System

## Test Philosophy
- Opaque-box, requirement-driven. Derives from `ORIGINAL_REQUEST.md`.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial + Real-World Workloads.
- Utilizes Node.js native test runner (`node:test` + `node:assert/strict`) for speed, ESM compliance, and zero runtime bloat.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | L1 5% Direct Commission Math | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 2 | L1 Idempotency & Direct Bonus Flag | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 3 | L1 Wallet Balance & Ledger Credits | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 4 | L2 5% Monthly Residual Math & Calculation | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 5 | L2 Idempotency in Cron Payouts | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 6 | L2 Referrer Wallet & Ledger Credits | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 7 | Referral API Data Contracts & Enrichment | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 8 | Referral Dashboard UI Integrity | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |

## Test Architecture
- **Test Runner**: Node.js native test runner via `npm test` (`node --test tests/**/*.test.mjs`)
- **Directory Layout**:
  - `tests/referral-utils.test.mjs` (Tier 1 & 2 Unit math, bounds, zeros, extreme values)
  - `tests/referral-calculations.test.mjs` (Tier 1 & 3 Two-Tier commission scenarios)
  - `tests/referrals-api-contract.test.mjs` (Tier 1 & 3 API payload structure & backward compatibility)
  - `tests/referral-idempotency.test.mjs` (Tier 2 & 3 Idempotency & Concurrency)
  - `tests/referral-e2e.test.mjs` (Tier 4 Real-World multi-referral, multi-cycle workload simulations)

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | ₹1,00,000 Limited Offer (6%/mo) 6-Month Full Lifecycle | F1, F3, F4, F6, F8 | High |
| 2 | Multiple Referrals with Mixed Currencies (INR & USD) | F1, F3, F8 | High |
| 3 | Concurrent & Repeated Cron Runs (Strict Idempotency) | F2, F5, F6 | High |
| 4 | Referral Claim Lifecycle (Earn -> Accumulate -> Claim) | F1, F4, F8, F9 | Medium |
| 5 | Non-Referred Users & Self-Referral Prevention | F1, F4, F6 | Medium |

## Coverage Thresholds
- Tier 1: ≥5 per feature (≥40 tests total)
- Tier 2: ≥5 per feature where boundaries exist (≥30 tests total)
- Tier 3: Pairwise combinations of schemes, rates, and payout cycles (≥10 tests)
- Tier 4: ≥5 realistic end-to-end workload simulations
- **Total test cases target**: ≥85 test assertions
