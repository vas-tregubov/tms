---
name: architecture-review
description: "Review TMS architectural changes for dependency boundaries, API contracts, maintainability, and testability."
---

# Architecture Review

Read and follow `.ai/instructions.md` and the shared review contract in
`.ai/skills/code-review/SKILL.md`. All repository paths are root-relative.
Apply the actual TMS stack and relevant project conventions: React/TypeScript,
Tailwind, FSD, Storybook, Vitest/Playwright, and NestJS/PostgreSQL or current mocks.
Do not assume planned infrastructure is implemented.

## Workflow

1. Establish the requested diff, files, or behavior. Limit analysis to relevant
   scope and affected consumers. Map affected responsibilities, module dependencies, public boundaries, and actual consumers. Check frontend FSD layer direction, same-layer slice coupling, public APIs, reuse, and absence of domain behavior in shared/ui. Compare against existing backend conventions without inventing undocumented architecture.
2. Load only applicable references listed below and validate suspected findings
   against existing protections, patterns, and actual behavior.
3. Use blocker, important, minor severity. Include location, concrete consequence here, supporting evidence, and minimum reasonable adjustment. Do not introduce layers or patterns speculatively.
4. Follow KISS: no invented problems, speculative refactoring, unnecessary
   abstractions, or dependencies. Review-only tasks authorize no code edits.
   For requested implementation, follow canonical planning and approval policy.
5. Sort findings by severity and anchor each to file/line or an exact fragment.
   Explicitly say no issue found in each reviewed category without findings.
   Mark irrelevant categories not applicable and unavailable evidence not
   verified. Report actual checks, results, and limitations.

## Reference selection

Paths below are relative to this skill directory.

- Responsibility and dependency concerns: [solid-antipatterns](references/solid-antipatterns.md).
- Public HTTP/data contracts: [api-contract](references/api-contract.md).
- Difficulty testing concrete behavior: [testability](references/testability.md).
