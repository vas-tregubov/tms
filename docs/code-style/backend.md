# Backend Code Style

## Technologies

The backend uses NestJS, TypeScript, ESLint, Prettier and Jest. It is currently
a scaffold; PostgreSQL is the planned persistence layer, not an implemented
integration. See [the persistence design](../database/erd.md) for database decisions
and [OpenAPI](../api/openapi.yaml) for the planned HTTP contract.

## Architecture and Files

Use a modular monolith with business modules under `src/<module>/`.
Dependencies follow Controller → Service → Repository:

- Controllers handle HTTP input/output and delegate use cases.
- Services own application and business operations.
- Repositories own database access and are added only when persistence is needed.

Do not create empty repositories, base classes or speculative module skeletons.
Keep related implementation and unit tests together (`*.spec.ts`); HTTP E2E tests
live in `test/`. Use Nest file suffixes such as `.module.ts`, `.controller.ts`,
`.service.ts` and, when needed, `.repository.ts`.

## Naming and Exports

Use `PascalCase` for classes, interfaces and type aliases; `camelCase` for
functions, methods and properties; `UPPER_SNAKE_CASE` for shared constants.
Use descriptive names and prefer `is`, `has`, `can` or `should` for booleans.

Use named exports for Nest classes and domain types, following the existing
scaffold. Frontend component default-export conventions do not apply here.

## Imports

Group Node built-ins, external packages, then relative imports, separated by
blank lines. Sort module paths and named imports alphabetically, case-insensitively;
preserve side-effect import order and use `import type` for type-only dependencies
where compatible with decorator metadata. Injectable runtime classes remain value
imports.

Use short relative paths within modules. No `@/` alias is configured: TypeScript
`paths` alone does not rewrite emitted imports for `node dist/main`. Keep imports
compatible with Nest development/build commands, plain Node and Jest rather than
adding runtime resolution solely for an alias.

## TypeScript and Boundaries

Prefer inferred local types and explicit request/response and service contracts
where they clarify a boundary. Avoid `any`; narrow unknown values before use.
TypeScript types do not validate HTTP input at runtime. Apply runtime validation
when real endpoints are implemented, using the approved API contract.

Keep HTTP-specific concerns in controllers and database details in repositories.
Handle asynchronous failures explicitly; do not leave floating Promises.
Do not introduce domain DTOs or abstractions before a real consumer exists.

## Checks and Formatting

ESLint provides type-aware checks and integrates Prettier. The existing backend
Prettier configuration uses single quotes, trailing commas and semicolons.
Do not duplicate tool rules with manual formatting requirements.

From the repository root:

```bash
npm --prefix backend run lint      # Check without changing files
npm --prefix backend run lint:fix  # Apply ESLint fixes explicitly
npm --prefix backend run format    # Format source and tests explicitly
npm --prefix backend test -- --runInBand
npm --prefix backend run build
```

The backend currently has no separate typecheck script; `nest build` performs
TypeScript compilation. Do not add dependencies solely for code-style enforcement.
