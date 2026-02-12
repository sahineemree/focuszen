# Agent Policies (Hard Rules)

## Git & Delivery
- Never commit directly to main/master.
- Always work on a branch:
  - daily/<YYYY-MM-DD>-<topic>
  - feature/<feature-name>
  - sprint/<N>-<name>
- Prefer small commits and small PRs.
- Every PR must include a clear "How to test" section.

## Security / Secrets
- Never read or modify secrets: .env, *.key, *.pem, certificates, signing configs.
- Never commit tokens, keys, or credentials.

## Scope Control
- Keep changes scoped to the requested task; avoid broad refactors.
- If scope is unclear, propose 2–3 options and ask Emre to choose before implementing.

## Quality Gates
- After implementing:
  - run format/lint (if configured)
  - run tests (at least relevant subset)
  - summarize what changed + verification steps
