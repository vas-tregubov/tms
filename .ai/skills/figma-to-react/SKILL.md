---
name: figma-to-react
description: Implement or synchronize React components, screens, and UI blocks from existing TMS Figma designs using Figma MCP and project conventions.
---

# Figma to React

Use this skill when implementing a React component from an existing Figma
component, synchronizing an existing React component with Figma, or bringing
a Figma screen or UI block into the frontend.

All project paths below are relative to the repository root.

## Workflow

1. Inspect the existing implementation, related components, and their usage.
2. Read `AGENTS.md`, `README.md`, `CONTRIBUTING.md`,
   `docs/code-style/README.md`, `docs/code-style/frontend.md`, and
   `docs/design-system/README.md`. Read `docs/domain-model.md` as required
   by project guidelines.
3. Use the TMS Figma file referenced in `docs/design-system/README.md`
   as the source of truth for UI design.
4. Inspect the specific master component or screen through Figma MCP:
   structure, variants/properties, states, styles, and Variables.
5. Compare Figma with the current code. Identify differences, reusable
   solutions, and any conflicts with the existing component API.
6. Reuse existing components, utilities, Tailwind styles, and design tokens.
   Shared tokens are in `frontend/src/app/styles/theme.css`.
   Follow FSD dependency rules and module public APIs.
7. Keep the solution limited to the current requirement. Do not introduce
   unnecessary abstractions, variants, states, or functionality.
   Add dependencies only when there is a specific need.
8. Before changing files, present a brief plan stating:
   - which files will change;
   - what will change;
   - which existing code will be reused.
9. Wait for user approval before modifying files.
10. Implement the approved scope without changing unrelated project areas.
11. After implementation:
    - show the changed files or diff;
    - run relevant project checks;
    - update or verify Storybook stories when applicable;
    - report any remaining differences from Figma.

## UI Component Rules

- Prefer native semantic HTML and preserve standard accessibility,
  including keyboard interaction, focus behavior, and native disabled behavior.
- Implement interactive hover, active, focus-visible, and disabled states
  through CSS/Tailwind rather than React props, unless they represent
  distinct business behavior.
- Do not add props merely because a corresponding property exists in Figma.
  Design the React API as a useful developer interface rather than a
  mechanical copy of the Figma structure.
- Use existing design tokens and Tailwind utilities for visual values
  instead of duplicating shared values as hardcoded styles.
- Do not create an icon library, loading API, i18n abstraction, or other
  system unless the current task requires it.
