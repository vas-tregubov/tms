---
name: code-review
description: "Review TMS code changes for correctness, regressions, project conventions, UI quality, and relevant security or performance risks."
---

# Code Review

## Shared review contract

This contract also applies to specialized review skills that reference it.
All repository paths are relative to the repository root.

- Read and follow `.ai/instructions.md` and its required project documentation.
  Use the actual implementation and relevant frontend/backend conventions:
  React, TypeScript, Tailwind, FSD, Storybook, Vitest and Playwright on the
  frontend; NestJS/TypeScript and PostgreSQL or current mocks where implemented.
  Do not assume planned infrastructure or undocumented backend behavior exists.
- Establish the requested diff, issue, files, or behavior before reviewing.
  Inspect relevant callers, consumers, tests, and contracts to verify impact;
  do not turn a bounded review into an unrelated repository audit.
- Review-only requests do not authorize code edits. Suggest fixes; implement
  only when requested and under the canonical planning and approval policy.
- Apply KISS. Report demonstrated problems, not hypothetical concerns,
  unnecessary abstractions, dependencies, or speculative refactoring.
- Anchor each finding to a concrete file and line or a quoted fragment. Include
  the trigger, observed evidence, practical impact, and smallest reasonable fix.
  Separate confirmed findings from questions and unverified assumptions.
- Sort findings by severity. Default labels: **blocker** (unsafe to merge or
  broken core behavior), **important** (material correctness or maintenance risk),
  **minor** (limited impact). Specialized security labels may refine these.
- For every reviewed category without findings, explicitly say **no issue found
  in the reviewed scope**. Mark irrelevant categories **not applicable** and
  unavailable evidence **not verified**, with the reason. Do not imply that an
  uninspected category is safe.
- Report checks actually run and their results, plus limitations and remaining
  verification needs. Do not invent successful tests or design comparisons.

## Workflow

1. Establish scope and intended behavior from the task or issue and actual diff.
2. Inspect implementation, consumers, and existing checks before judging changes.
3. Select applicable categories below. Prioritize correctness and regressions.
4. Validate suspected findings against reachable behavior and project conventions.
   Run relevant existing checks when useful; avoid tests that mirror code.
5. Return severity-sorted findings, category outcomes, and verification limits.

## Review categories

- Scope: task/issue alignment, unrelated changes, and scope creep.
- Correctness: edge cases, regressions, backward compatibility, public APIs,
  error handling, validation, and affected shared consumers.
- Architecture: FSD layer direction, slice public APIs, reuse of existing
  components, utilities, types, and styles; no domain logic in `shared/ui`.
- UI: semantic HTML, accessibility, keyboard and focus behavior, hover/active/
  disabled states, existing design tokens rather than duplicated hardcoded
  shared colors/values. Reuse the existing Icons Library and shared icon API;
  inspect `frontend/src/shared/assets/icons/` instead of suggesting placeholders
  or hand-written SVG when an existing icon fits.
- Design fidelity for frontend UI: use `docs/design-system/README.md` and
  `.ai/skills/figma-to-react/SKILL.md` for the relevant Figma reference and
  comparison workflow. Compare only the requested design and states. If Figma
  access is unavailable, state that fidelity is not verified. Check responsive
  behavior only when included in scope.
- Verification: Storybook coverage of meaningful reusable UI states; interaction
  tests for application-owned logic. Do not demand tests just for coverage,
  framework/native behavior, Tailwind classes, or obvious static markup.
- Risk: security and performance concerns supported by the diff; premature
  abstractions and dependencies without a present need.

## Specialized follow-up guidance

Recommend a focused skill when evidence warrants deeper review:

- Security-sensitive code: `.ai/skills/security-review/SKILL.md`.
- Database or performance changes: `.ai/skills/performance-review/SKILL.md`.
- Architectural changes: `.ai/skills/architecture-review/SKILL.md`.
- Refactor-focused tasks: `.ai/skills/refactoring-review/SKILL.md`.

These are workflow recommendations, not automatic orchestration. Keep the
review within its requested scope.
