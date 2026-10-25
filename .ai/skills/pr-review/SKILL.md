---
name: pr-review
description: "Review a TMS pull request or diff for compatibility, regressions, scope, reviewability, and clear PR context and verification."
---

# PR Review

Read and follow `.ai/instructions.md` and the shared review contract in
`.ai/skills/code-review/SKILL.md`. Apply relevant TMS stack and conventions.
Review-only requests authorize no code edits or external PR mutations.

## Workflow

1. Establish PR base/head, intended merge base, task/issue, and requested diff.
   Do not assume a base or confuse existing worktree changes with PR changes.
   State missing context and inspect relevant consumers, tests, and contracts.
2. Apply relevant code-review categories. Check backward compatibility, edge
   cases, regressions, affected shared utilities/components, public API changes,
   scope creep, and whether the change is understandable and verifiable.
3. Review title/description for the concrete problem, resulting behavior,
   sufficient context, material risks, and clear manual verification steps and
   results. Do not demand a ritual template for a tiny change. Separate missing
   evidence from an implementation defect.
4. Sort findings as blocker, important, minor. Cite file/line or an exact
   title/description fragment, evidence, impact, and smallest fix. Explicitly
   report no issue per reviewed category where true, not applicable/not verified
   categories, actual checks and limitations. Apply KISS; avoid invented issues,
   speculative refactoring, and unnecessary abstractions.
5. When useful, propose a better title/description using observed facts: problem,
   resulting behavior, relevant implementation details, verification, and known
   risks. Mark unrun checks or unknowns; never invent approvals, issue links,
   screenshots, or successful verification.

## Review comments

Use calm professional comments: what raises the question, why it matters, a
possible fix, and a short example. Acknowledge that the author may have a valid
reason without obscuring a demonstrated finding. Adapt this only with evidence:

> Could we preserve the empty-list response here? Returning null appears to
> break consumers calling `.map()`. Returning `[]` would preserve that contract.
> If this API change is intentional, could you point to the consumer migration?

Return draft comments. Posting comments or editing PR metadata requires an
explicit request. Follow canonical Git policy throughout.
