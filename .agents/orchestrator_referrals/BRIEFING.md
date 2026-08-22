# BRIEFING — 2026-08-22T08:23:22Z

## Mission
Orchestrate the design, implementation, testing, review, and verification of the two-tier referral commission system for Hashprime.

## 🔒 My Identity
- Archetype: orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /Users/mohammedarif/hashprime-main/.agents/orchestrator_referrals
- Original parent: parent
- Original parent conversation ID: c3c92864-21b0-45e2-ada1-6bf4f371e1cb

## 🔒 My Workflow
- **Pattern**: Project Orchestrator
- **Scope document**: /Users/mohammedarif/hashprime-main/.agents/PROJECT.md
1. **Decompose**: Survey codebase with 3 explorers, define Feature Inventory & Milestones in PROJECT.md.
2. **Dispatch & Execute**:
   - Implementation Track (Milestone sub-orchestration / Workers)
   - E2E Testing Track (test creation, runners, verification)
   - Iteration Loop: Explorer -> Worker -> Reviewers (2) -> Challengers (2) -> Forensic Auditor -> Gate
3. **On failure**: Retry -> Replace -> Skip -> Redistribute -> Redesign -> Escalate
4. **Succession**: Threshold at 16 spawns
- **Work items**:
  1. Survey phase [in-progress]
  2. Architecture & PROJECT.md definition [pending]
  3. Milestone 1: L1 Direct Commission & Idempotency [pending]
  4. Milestone 2: L2 Recurring Monthly Commission in cron.js [pending]
  5. Milestone 3: Referral APIs & Dashboard UI [pending]
  6. Milestone 4: E2E Testing & Coverage Hardening [pending]
  7. Final Milestone: Gate verification & human report [pending]
- **Current phase**: 0 (Survey)
- **Current focus**: Parallel exploration of codebase and requirements

## 🔒 Key Constraints
- Dispatch-only: NEVER write, modify, or create source code directly.
- NEVER run build/test commands directly — workers and reviewers do this.
- NEVER investigate at code level directly — dispatch Explorers.
- Audit veto: Forensic Auditor INTEGRITY VIOLATION is an unconditional failure.
- Never reuse subagents after handoff delivery.

## Current Parent
- Conversation ID: c3c92864-21b0-45e2-ada1-6bf4f371e1cb
- Updated: 2026-08-22T08:23:22Z

## Key Decisions Made
- Use Project Orchestrator pattern with dual tracks (Implementation & E2E Testing).
- Survey phase with 3 Explorers mapping models/activation, cron/payments, and UI/APIs.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_1 | teamwork_preview_explorer | Survey Models & L1 Activation | completed | 80926eb1-7a3c-40b9-ba05-c230019c0f81 |
| explorer_2 | teamwork_preview_explorer | Survey Cron & L2 Monthly Residual | completed | 869410ce-76a8-44dc-a308-d564da767c07 |
| explorer_3 | teamwork_preview_explorer | Survey Referral APIs, UI & Tests | completed | 38b745bb-0361-4167-ae91-7453d8574daf |
| worker_1 | teamwork_preview_worker | M1: Models & L1 Direct Commission | in-progress | c125e5bb-f514-40f0-a9c9-14748f35f21e |
| test_writer_m4 | teamwork_preview_worker | M4: E2E Test Suite & Infrastructure | in-progress | 077a3168-bea9-4842-870d-4eac1e1f47b4 |

## Succession Status
- Succession required: no
- Spawn count: 5 / 16
- Pending subagents: c125e5bb-f514-40f0-a9c9-14748f35f21e, 077a3168-bea9-4842-870d-4eac1e1f47b4
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: not started
- Safety timer: none

## Artifact Index
- /Users/mohammedarif/hashprime-main/.agents/ORIGINAL_REQUEST.md — Original User Request
- /Users/mohammedarif/hashprime-main/.agents/orchestrator_referrals/DISPATCH.md — Incoming Dispatch
- /Users/mohammedarif/hashprime-main/.agents/orchestrator_referrals/BRIEFING.md — Working memory
- /Users/mohammedarif/hashprime-main/.agents/orchestrator_referrals/plan.md — Execution plan
- /Users/mohammedarif/hashprime-main/.agents/orchestrator_referrals/progress.md — Progress and heartbeat
