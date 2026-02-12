# Rituals

## Daily: 1 Push / Day (Visibility Rule)
Definition of a "daily push":
- A meaningful increment that changes the product or foundations:
  - a new screen stub + routing
  - a module skeleton + interfaces
  - a test harness / lint setup
  - a bugfix + verification notes
Not counted:
- whitespace-only, rename-only, or empty commits

Daily steps:
1) Create branch: daily/<YYYY-MM-DD>-<topic>
2) Make one increment
3) Run quick checks (lint/test subset if available)
4) Commit: "daily: <what changed>"
5) Push branch to GitHub

Optional but recommended:
- Add a short log under /docs/daily/<YYYY-MM-DD>.md

## Sprint end (Integration)
1) Ensure sprint branch is green
2) Prepare PR into main/master (summary + checklist + risks)
3) Merge only after Emre approval
