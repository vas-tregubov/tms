# TMS

Transport Management System for route planning and delivery operations.

## Current State

The dispatcher frontend runs with in-memory mock data. It includes Routes List,
Details, Create and Edit; Trips List, Details and Create; filtering, navigation,
and application error boundaries. Mock changes last for the current browser
session and are lost on reload.

The NestJS backend is a scaffold with a sample endpoint and Jest tests. The
frontend is not connected to a production backend. PostgreSQL persistence and
the HTTP API are documented designs, not implemented integrations.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Redux Toolkit
  and RTK Query; Storybook, Vitest/React Testing Library and Playwright.
- Backend: NestJS and TypeScript; Jest.
- CI: GitHub Actions frontend checks.

## Local Development

Install dependencies and configure Git hooks from the repository root:

```bash
npm run setup
npm --prefix frontend run dev
```

The frontend works independently of the backend. To run the backend scaffold:

```bash
npm --prefix backend run start:dev
```

## Project Documentation

- [Contributing and Git workflow](CONTRIBUTING.md)
- [Code style](docs/code-style/README.md)
- [Frontend testing strategy and commands](docs/testing-strategy/README.md)
- [Current domain model](docs/domain-model.md)
- [Planned persistence model and open decisions](docs/database/erd.md)
- [Planned OpenAPI contract](docs/api/openapi.yaml)
- [Backend commands](backend/README.md)

Domain Model and OpenAPI still contain field shapes that need synchronization
with the persistence design in a separate task.
