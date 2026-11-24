# TMS

Transport Management System for route planning and delivery operations.

## Current State

The dispatcher frontend supports Routes List, Details, Create and Edit, and Trips
List, Details and Create using in-memory mock data. Changes are lost on reload.

The backend has PostgreSQL connectivity and global HTTP validation/error handling.
Business APIs and persistence entities are not implemented yet.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Redux Toolkit
  and RTK Query; Storybook, Vitest/React Testing Library and Playwright.
- Backend: NestJS, TypeScript, PostgreSQL and Jest.
- CI: GitHub Actions frontend checks.

## Local Development

From the repository root:

```bash
npm run setup
cp -n backend/.env.example backend/.env
```

Local development requires PostgreSQL 17 with a `tms_dev` database. Update
`backend/.env` with your connection settings. The separate `tms_test` database is
used for backend E2E and configured when preparing the test environment. Keep
credentials out of Git.

Run the frontend and backend in separate terminals:

```bash
npm --prefix frontend run dev
```

```bash
npm --prefix backend run start:dev
```

## Documentation

- [Contributing and Git workflow](CONTRIBUTING.md)
- [Code style](docs/code-style/README.md)
- [Testing strategy](docs/testing-strategy/README.md)
- [Domain model](docs/domain-model.md)
- [Database design and open decisions](docs/database/erd.md)
- [OpenAPI contract](docs/api/openapi.yaml)
- [Design system](docs/design-system/README.md)
