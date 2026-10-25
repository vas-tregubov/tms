---
name: security-review
description: "Review security-sensitive TMS changes for exploitable application, authorization, input-handling, dependency, and secret-exposure risks."
---

# Security Review

Read and follow `.ai/instructions.md` and the shared review contract in
`.ai/skills/code-review/SKILL.md`. All repository paths are root-relative.
Apply the actual TMS stack and relevant project conventions: React/TypeScript,
Tailwind, FSD, Storybook, Vitest/Playwright, and NestJS/PostgreSQL or current mocks.
Do not assume planned infrastructure is implemented.

## Workflow

1. Establish the requested diff, files, or behavior. Limit analysis to relevant
   scope and affected consumers. Identify protected data, actors, external inputs, and changed trust boundaries. Trace reachable attacker-controlled paths through existing guards and validation before reporting a vulnerability.
2. Load only applicable references listed below and validate suspected findings
   against existing protections, patterns, and actual behavior.
3. Use Critical, High, Medium, Low severity in that order. Include vulnerability, location, evidence, attacker prerequisites, realistic exploitation scenario, impact, and concrete minimal fix. Do not invent payloads or vulnerabilities without implementation evidence.
4. Follow KISS: no invented problems, speculative refactoring, unnecessary
   abstractions, or dependencies. Review-only tasks authorize no code edits.
   For requested implementation, follow canonical planning and approval policy.
5. Sort findings by severity and anchor each to file/line or an exact fragment.
   Explicitly say no issue found in each reviewed category without findings.
   Mark irrelevant categories not applicable and unavailable evidence not
   verified. Report actual checks, results, and limitations.

## Reference selection

Paths below are relative to this skill directory.

- Queries, rendering, parsing, command/file operations, and data exposure: [application-security](references/application-security.md).
- Identity, sessions, ownership, roles, and guards: [auth-authorization](references/auth-authorization.md).
- External input flows: [input-tracing](references/input-tracing.md).
- Manifests, lockfiles, and package execution: [supply-chain](references/supply-chain.md).
- Credentials, configuration, fixtures, and logs: [secrets](references/secrets.md).
