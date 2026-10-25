---
name: performance-review
description: "Review TMS changes for evidence-based algorithmic, database, memory, resource, and hot-path performance problems."
---

# Performance Review

Read and follow `.ai/instructions.md` and the shared review contract in
`.ai/skills/code-review/SKILL.md`. All repository paths are root-relative.
Apply the actual TMS stack and relevant project conventions: React/TypeScript,
Tailwind, FSD, Storybook, Vitest/Playwright, and NestJS/PostgreSQL or current mocks.
Do not assume planned infrastructure is implemented.

## Workflow

1. Establish the requested diff, files, or behavior. Limit analysis to relevant
   scope and affected consumers. Establish realistic input sizes, operation frequency, and latency/resource constraints. Inspect callers, queries, lifetimes, and available profiles. Separate measured regressions from estimates; do not prescribe caching or memoization by default.
2. Load only applicable references listed below and validate suspected findings
   against existing protections, patterns, and actual behavior.
3. Use blocker, important, minor severity. Include location, triggering workload, cost before/after, minimal improvement, and readability/memory tradeoffs. State when profiling is needed.
4. Follow KISS: no invented problems, speculative refactoring, unnecessary
   abstractions, or dependencies. Review-only tasks authorize no code edits.
   For requested implementation, follow canonical planning and approval policy.
5. Sort findings by severity and anchor each to file/line or an exact fragment.
   Explicitly say no issue found in each reviewed category without findings.
   Mark irrelevant categories not applicable and unavailable evidence not
   verified. Report actual checks, results, and limitations.

## Reference selection

Paths below are relative to this skill directory.

- Growing collections and repeated work: [complexity](references/complexity.md).
- Queries and ORM relations: [database](references/database.md).
- Resource lifetimes, effects, subscriptions, and caches: [memory-resources](references/memory-resources.md).
- Frequent or profiled operations: [hot-paths](references/hot-paths.md).
