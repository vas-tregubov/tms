# Frontend Testing Strategy

## Purpose

Frontend tests must protect meaningful application behavior and reduce regression risk.

Tests are selected based on behavior and risk, not file count or coverage targets.

Use the lowest test level that reliably protects the required behavior.

## Test Stack

- **Vitest** — unit and component/integration test runner.
- **React Testing Library** — React component and integration tests.
- **Playwright** — end-to-end tests.
- **Storybook** — visual development and UI documentation.

Do not add a second framework for the same responsibility.

Do not add Cypress while Playwright is the project E2E framework.

## Unit Tests

Use unit tests for isolated application logic such as:

- pure functions;
- formatters;
- validators;
- reducers;
- selectors;
- transformations;
- other deterministic application logic.

Do not test framework or library internals.

## Component and Integration Tests

Use Vitest with React Testing Library for meaningful React behavior such as:

- user interactions;
- conditional rendering;
- state transitions;
- form validation;
- multi-step flows;
- loading, success and error states;
- feature composition;
- routing integration;
- application behavior across multiple components.

Test observable user-facing behavior.

Avoid testing implementation details.

## UI Components

Do not automatically add tests for every UI component.

Static presentation-only components usually do not require automated tests.

Add tests when a component contains meaningful custom behavior, state or interaction.

Do not add tests only to verify:

- Tailwind classes;
- CSS layout;
- decorative SVG rendering;
- native browser behavior;
- trivial prop forwarding.

## Pages

Do not test a Page only because it is a Page.

Add component/integration tests when the Page contains meaningful orchestration, interaction or application state.

Avoid repeating tests already covered by lower-level components or features.

## Redux Toolkit and RTK Query

Do not test Redux Toolkit or RTK Query internals.

Test project-owned logic such as:

- reducers;
- selectors;
- transformations;
- custom state behavior;
- meaningful query or mutation integration behavior.

## Routing

Test application routing behavior, not React Router internals.

Examples include:

- rendering the expected Page for a route;
- navigation between application routes;
- route parameters;
- unknown-route handling.

## End-to-End Tests

Use Playwright for critical dispatcher workflows that cross real application boundaries.

Add E2E coverage for critical workflows as those workflows are implemented and stabilized.

Prefer lower-level tests when they provide the same protection more reliably and cheaply.

Do not duplicate every component-level scenario as E2E.

## Accessibility

Use:

- semantic HTML;
- keyboard-accessible interaction;
- accessible roles, labels and states;
- manual accessibility checks;
- Lighthouse and browser accessibility tools where applicable.

Do not add a dedicated accessibility testing dependency unless the project has a concrete need for it.

## Coverage

Coverage is a diagnostic metric, not a project target.

Do not add an arbitrary global coverage threshold.

Do not create tests only to increase coverage percentage.

Use coverage later to identify important untested areas when useful.

## Test Placement

Keep unit and component/integration tests close to the code they test.

Examples:

```text
ui/
├── Component.tsx
└── Component.test.tsx
```

```text
model/
├── reducer.ts
└── reducer.test.ts
```

Keep Playwright E2E tests in the existing dedicated E2E structure.

Do not create shared test utilities until there is real reuse.

## Mocking

Mock external boundaries only when required by the test.

Prefer real project components and application logic where practical.

Avoid unnecessary mocking of:

- React;
- library internals;
- every child component;
- browser primitives.

## Test Selection

When implementing or changing functionality, determine:

1. what meaningful behavior can regress;
2. how important that regression is;
3. which test level protects it with the least complexity;
4. whether the behavior is already covered elsewhere.

If the value of a test is unclear, explain the trade-off before adding it.

Do not automatically create a test for every changed file.

## Pull Request Checks

The target frontend PR checks are:

- lint;
- typecheck;
- Vitest;
- production build.

Playwright execution in CI is configured separately as the E2E suite and test environment mature.

Do not move the full test suite into local Git hooks.

## AI Agent Rules

When adding or changing frontend functionality:

- follow this Testing Strategy;
- identify meaningful behavior before writing tests;
- prefer stable user-facing assertions;
- avoid implementation-detail tests;
- avoid duplicate coverage across test levels;
- do not add testing dependencies without a concrete need;
- do not create temporary test configs or alternative runners;
- do not expand test scope only to increase coverage.
