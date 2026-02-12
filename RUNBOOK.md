# FocusZen Runbook (Agent Workflow)

This repo uses an architecture-first, offline-first approach. Keep changes small, verify often, and ship daily.

## Branching rules (hard)
Never commit directly to main.
Work on branches:
- daily/<YYYY-MM-DD>-<topic>
- feature/<feature-name>
- sprint/<N>-<name>

## Output format (mandatory)
All agent outputs must use:
- Decision
- Plan
- Implementation
- Verification

## Roles and responsibilities
- Lead: scope control, architecture discipline, delegation, PR summary
- Architect: module boundaries, layer rules, file placement
- PM: user story, acceptance criteria, out-of-scope, risks
- UX: screen flow, copy (TR), edge cases, accessibility
- Mobile: implement in small commits, respect boundaries
- QA: manual checklist, regression risks

## Architecture guardrails (hard)
- `app/` is routing only (Expo Router).
- All product code lives in `src/`.
- Feature modules: `src/modules/<feature>/{presentation,domain,data}`.
- Layering:
  - presentation -> domain -> data
  - domain must not import from presentation/data/platform
  - data may import domain
  - platform adapters live in `src/platform`

## Daily rhythm (1 push/day)
A "daily push" must include meaningful progress:
- screen stub + routing
- module skeleton + interfaces
- persistence/audio baseline change
- bugfix + verification notes

## Standard workflows

### A) Plan a feature
Use Codex and request:
- user story + acceptance criteria
- architecture impact + file plan
- tasks (small, ordered)
- test plan

### B) Implement a feature
1) Create branch: feature/<name> (or daily/<date>-<topic>)
2) Implement in small commits
3) Run quick checks (lint/typecheck/tests if available)
4) Push to GitHub
5) Prepare PR text (must include "How to test")

### C) Verify
- Provide a manual test checklist
- Note regression risks
- Confirm commands run: `npx expo start` + basic smoke

## Commands (copy/paste)

Check branch:
- git branch --show-current

Start Expo (clean):
- npx expo start -c

Daily branch:
- DATE=$(date +%F)
- git checkout -b "daily/$DATE-<topic>"

Commit + push:
- git add .
- git commit -m "daily: <what changed>"
- git push -u origin HEAD
