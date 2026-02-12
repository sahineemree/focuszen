# Command Protocol (Codex CLI Chat)

The Lead Agent orchestrates roles using the files under .agent/.

Commands used in chat:
- /lead <request>
  - Analyze, challenge scope, propose MVP vs extras, ask minimal questions

- /plan <feature>
  - Output: story, acceptance criteria, architecture impact, tasks, file plan

- /implement <feature>
  - Create branch feature/<feature>
  - Implement in small commits
  - Run checks
  - Prepare PR description text

- /daily <topic>
  - Create branch daily/<date>-<topic>
  - Implement one increment + commit + push

- /verify <feature|branch>
  - Run tests/lint and produce QA checklist

Output format:
- Decision
- Plan
- Implementation
- Verification
