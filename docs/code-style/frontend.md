# Frontend Code Style

This document defines the main conventions for writing frontend code in the TMS project.

## Technologies

The frontend application uses:

* React;
* TypeScript;
* Vite;
* Tailwind CSS;
* Feature-Sliced Design;
* Storybook;
* Vitest;
* Playwright;
* ESLint;
* Prettier.

## React Components

Components should be written as arrow functions.

```tsx
type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
}

const Button = ({ children, disabled = false }: ButtonProps) => {
  return (
    <button type="button" disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
```

Use `export default` for React components.

Each file should contain only one primary React component.

The filename should match the component name:

```text
Button.tsx
RouteCard.tsx
RoadsListPage.tsx
```

## Naming Conventions

React components, component files, and TypeScript types should use `PascalCase`:

```ts
Button
ButtonProps
RouteCard
RoadsListPage
```

Functions, variables, and properties should use `camelCase`:

```ts
createRoute
selectedDriver
isLoading
routeStatus
```

Shared application constants should use `UPPER_SNAKE_CASE`:

```ts
const DEFAULT_PAGE_SIZE = 20
const API_TIMEOUT = 5000
```

Boolean values should start with `is`, `has`, `can`, or `should` whenever possible:

```ts
isLoading
isDisabled
hasError
canEdit
shouldRefresh
```

## Props

Component props types should follow the `<ComponentName>Props` naming pattern:

```tsx
type ButtonProps = {
  children: React.ReactNode
  disabled?: boolean
  isLoading?: boolean
}
```

Components should receive the required data and event handlers through props:

```tsx
type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
}

const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
```

Redux and other global state management tools do not replace props.

Use props for local component data and event handlers. Use global state only for data that is genuinely required by multiple independent parts of the application.

## Imports and Aliases

Use the `@` alias for imports from `src`:

```tsx
import Button from '@/shared/ui/Button'
import RouteCard from '@/entities/route/ui/RouteCard'
```

Avoid long relative import paths:

```tsx
// Not recommended
import Button from '../../../../shared/ui/Button'
```

Short relative imports are allowed within the same module:

```tsx
import Button from './Button'
import type { ButtonProps } from './types'
```

## Feature-Sliced Design

The frontend application uses the following layers:

```text
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

Layer responsibilities:

* `app` — application initialization and global configuration;
* `pages` — application pages;
* `widgets` — large, self-contained page sections;
* `features` — user actions and business scenarios;
* `entities` — business entities;
* `shared` — reusable components, utilities, API clients, and assets.

Dependencies must flow from higher layers to lower layers:

```text
app → pages → widgets → features → entities → shared
```

A lower layer must not import from a higher layer.

For example:

```text
features can import from entities and shared
entities can import from shared
shared must not import from any other FSD layer
```

Slices within the same layer must not depend directly on one another.

A slice should expose a public API through an `index.ts` file.

Example:

```text
shared/ui/Button/
├── Button.tsx
├── Button.stories.tsx
├── Button.test.tsx
└── index.ts
```

```ts
// shared/ui/Button/index.ts
export { default } from './Button'
```

Usage:

```tsx
import Button from '@/shared/ui/Button'
```

Do not import internal slice files by bypassing their public API.

## Styling

Components should be styled primarily with Tailwind CSS utility classes.

```tsx
const Button = ({ children }: ButtonProps) => {
  return (
    <button className="rounded-control bg-primary px-4 py-2 text-white hover:bg-primary-hover">
      {children}
    </button>
  )
}
```

Global styles and the Tailwind import are located in:

```text
src/app/styles/index.css
```

Shared design tokens are located in:

```text
src/app/styles/theme.css
```

Design tokens should contain:

* brand colors;
* text and background colors;
* fonts;
* border radii;
* shadows;
* other shared visual values.

Example:

```css
@theme {
  --color-primary: #0875e1;
  --color-primary-hover: #0668ca;
  --color-background: #f3f7fb;
  --color-foreground: #102044;
  --radius-control: 0.375rem;
  --shadow-card: 0 1px 3px rgb(15 23 42 / 8%);
}
```

After defining the tokens, use the corresponding Tailwind classes:

```tsx
<button className="rounded-control bg-primary hover:bg-primary-hover">
  Create route
</button>
```

Do not duplicate brand colors as arbitrary values across multiple components:

```tsx
// Not recommended
<button className="bg-[#2563eb]">Create route</button>
```

Arbitrary values are allowed only for rare local cases that are not part of the shared design system.

## Storybook

Create Storybook stories for reusable UI components.

```text
Button.tsx
Button.stories.tsx
```

Create stories for meaningful component states:

* Default;
* Disabled;
* Loading.

If a component has visual variants, create separate stories for them:

* Primary;
* Secondary;
* Danger.

The `Danger` variant is intended for actions with potentially destructive consequences, such as deleting a route.

A story must not duplicate the component implementation. It should only pass specific props to the component and display the result.

## Tests

Use Vitest to test component and function logic.

Test meaningful behavior such as:

* handling user actions;
* displaying loading states;
* disabling unavailable actions;
* conditionally displaying data;
* transforming data.

There is no need to test every Tailwind class or obvious static markup.

Use Playwright for important user flows involving multiple components or pages.

## Automatic Formatting

ESLint checks code quality and correctness.

Prettier ensures consistent code formatting.

Before each commit, Husky and lint-staged automatically check the staged files.

Do not format code manually with spaces and line breaks when Prettier can handle it automatically.
