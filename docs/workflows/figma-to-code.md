# Figma to Code Workflow

For every Figma → frontend task:

1. First, review the existing implementation and related components.
2. Read the project guidelines: `README.md`, `CONTRIBUTING.md`, `docs/code-style/README.md`, and `docs/code-style/frontend.md`. For UI related to domain entities, review `docs/domain-model.md`.
3. Use the TMS Figma file referenced in `docs/design-system/README.md` as the source of truth for UI design.
4. Before implementation, inspect the specific component or screen through the Figma integration/MCP: its structure, variants/properties, states, styles, and Variables.
5. Compare Figma with the existing code.
6. Reuse existing components, utilities, styles, and design tokens, following FSD and module public APIs. Shared design tokens are located in `frontend/src/app/styles/theme.css`.
7. Do not create new abstractions, variants, states, or functionality unless required for the current task.
8. Do not add a dependency without a specific need.
9. Before changing code, present a brief plan:
   - which files will be changed;
   - what exactly will be changed;
   - which existing solutions will be reused.
10. Change code only after user confirmation.
11. After implementation:
    - show the git diff / list of changed files;
    - run relevant project checks;
    - update or verify Storybook stories for the UI, if they exist;
    - report any remaining differences from Figma.
12. Do not modify unrelated parts of the project.
