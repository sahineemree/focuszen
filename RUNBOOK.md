# FocusZen Runbook (Agent Workflow)

This repo is architecture-first and offline-first. Keep scope tight, ship daily, and avoid spaghetti.

## Hard rules
- Never commit directly to main.
- Work only on branches:
  - daily/<YYYY-MM-DD>-<topic>
  - feature/<feature-name>
  - sprint/<N>-<name>
- Every PR must include “How to test”.
- No secrets committed (.env, keys, certs).

## Mandatory output format
All agent outputs must be:
- Decision
- Plan
- Implementation
- Verification

## Architecture guardrails
- `app/` is routing only (Expo Router).
- All product code is in `src/`.
- Feature modules: `src/modules/<feature>/{presentation,domain,data}`.
- Layering:
  - presentation -> domain -> data
  - domain must not import from presentation/data/platform
  - data may import domain
- Expo API adapters live in `src/platform`.

## Daily rhythm (1 push/day)
A daily push must be meaningful (feature increment, module skeleton, baseline wiring, bugfix + verification).

## Standard workflows

### Plan
- Confirm scope + constraints + acceptance criteria
- Produce file plan + tasks + test plan

### Implement
1) Create branch (daily/feature/sprint)
2) Small commits
3) Run quick checks
4) Push to GitHub
5) PR text includes “How to test”

### Verify
- Manual checklist
- Regression risks
- Smoke test: `npx expo start -c`

## Copy/paste commands
- Current branch: `git branch --show-current`
- Clean start: `npx expo start -c`
- Daily branch:
  - DATE=$(date +%F)
  - git checkout -b "daily/$DATE-<topic>"
- Commit + push:
  - git add .
  - git commit -m "daily: <what changed>"
  - git push -u origin HEAD
