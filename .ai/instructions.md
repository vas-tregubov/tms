# TMS AI Instructions

This file contains the canonical repository-wide AI instructions. Canonical
skills live under `.ai/skills/`; provider-specific files are thin adapters.
All paths below are relative to the repository root.

## Required reading

Before making changes, read:

- `README.md`
- `CONTRIBUTING.md`
- `docs/code-style/README.md`
- `docs/domain-model.md`

For frontend tasks, also read `docs/code-style/frontend.md`.
For backend tasks, also read `docs/code-style/backend.md`.
For UI / Figma tasks, also read `docs/design-system/README.md` and
`.ai/skills/figma-to-react/SKILL.md`.

## Implementation

- Follow the existing project architecture and conventions.
- Inspect the existing implementation before changing it.
- Prefer the simplest solution that satisfies the current requirement (KISS).
- Reuse existing components, utilities, styles, and design tokens.
- Do not add speculative functionality or unnecessary abstractions or dependencies.
- Do not modify unrelated parts of the project.
- After implementation, run relevant project checks and summarize the changes.
- Keep project documentation and instruction files in English.

## Planning and approval

Show a short implementation plan before changing files. If the user has already
explicitly approved the task scope or instructed the agent to proceed, continue
without asking again. Ask again only when expanding scope, adding dependencies,
changing architecture, or performing potentially destructive actions.

## Git policy

Coding agents must not:

- execute `git commit` or `git push`;
- merge pull requests;
- delete branches;
- amend or rewrite commits;
- bypass hooks with `--no-verify`.

Agents may inspect `git status`, `git diff`, and `git log`, fetch remote
information, create or switch task or review branches when explicitly requested,
modify files within the approved scope, and run checks.

If asked to commit, push, or merge, state that project policy forbids the agent
from doing so and provide exact Git commands and a proposed commit message for
the developer to run manually. Branch deletion is also performed manually.
This is an instruction policy; it does not introduce technical enforcement hooks.
