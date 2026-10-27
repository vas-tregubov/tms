---
name: refactoring-review
description: "Review TMS code for justified improvements to readability, naming, and responsibility boundaries while preserving behavior."
---

# Refactoring Review

Read and follow `.ai/instructions.md` and the shared review contract in
`.ai/skills/code-review/SKILL.md`. All repository paths are root-relative.
Apply the actual TMS stack and relevant project conventions: React/TypeScript,
Tailwind, FSD, Storybook, Vitest/Playwright, and NestJS/PostgreSQL or current mocks.
Do not assume planned infrastructure is implemented.

## Workflow

1. Establish the requested diff, files, or behavior. Limit analysis to relevant
   scope and affected consumers. Record observable behavior, errors, side effects, evaluation order, async sequencing, and public contracts. Inspect callers and behavioral tests. Find concrete comprehension costs rather than stylistic preferences.
2. Load only applicable references listed below and validate suspected findings
   against existing protections, patterns, and actual behavior.
3. Use blocker, important, minor severity. Give location, reason, smallest behavior-preserving suggestion, and verification needs. Label any potentially behavior-changing proposal questionable and do not apply it automatically. Keep behavior fixes separate from refactoring.
4. Follow KISS: no invented problems, speculative refactoring, unnecessary
   abstractions, or dependencies. Review-only tasks authorize no code edits.
   For requested implementation, follow canonical planning and approval policy.
5. Sort findings by severity and anchor each to file/line or an exact fragment.
   Explicitly say no issue found in each reviewed category without findings.
   Mark irrelevant categories not applicable and unavailable evidence not
   verified. Report actual checks, results, and limitations.

## Reference selection

Paths below are relative to this skill directory.

- Confusing flow or expressions: [readability](references/readability.md).
- Names obscuring meaning: [naming](references/naming.md).
- Mixed responsibilities and extraction boundaries: [function-size](references/function-size.md).
