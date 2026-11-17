# TMS Backend

NestJS 11/TypeScript with a local PostgreSQL connection through TypeORM. Business
entities, repositories and endpoints are not implemented; `GET /` remains the
scaffold endpoint. The frontend still uses its own in-memory mock API.

## Local Setup

Use Node 24 (24.11 or newer) and the existing local PostgreSQL 17 server. From the
repository root, install project dependencies with `npm run setup`, then:

```bash
cd backend
cp -n .env.example .env
npm run build
npm run db:check
npm run start:dev
```

If `.env` already exists, edit it instead of overwriting it. The example assumes
`localhost:5432`, user `vas`, development database `tms_dev`, and test database
`tms_test`. These databases must already exist; no command here deletes or
recreates them. No password is included in the example. If the server requires
one, set `DB_PASSWORD` in the ignored local `.env` or the process environment.
Do not commit credentials.

Both Nest and the TypeORM CLI use `src/database/database.config.ts`. The built-in Node parser reads
`backend/.env` independently of the caller's working directory; exported process
variables take precedence. Host, port, user and database are validated before
connecting. Configuration errors identify variable names, not their values.
This is a local connection setup, not a production TLS/deployment configuration.

`db:check` executes `SELECT 1` and closes its connection. Nest closes its pool
when the application shuts down; startup fails if the database is unavailable.

## Migrations

Migrations live in `src/database/migrations/` and run as compiled JavaScript from
`dist/database/migrations/`. The CLI uses the same configuration as Nest through
`src/database/data-source.ts`.

`synchronize` and `migrationsRun` are always false: application startup never
changes the schema or applies migrations automatically. After creating or
editing a migration, rebuild before running the CLI:

```bash
# From backend/: create a migration only when an actual schema change is needed
npm run migration:create -- src/database/migrations/DescribeChange
npm run build

# Review and apply migrations explicitly to the test database first
DB_NAME=tms_test npm run migration:show
DB_NAME=tms_test npm run migration:run
DB_NAME=tms_test npm run migration:revert
```

Only revert migrations on a disposable test database after checking their `down`
implementation. Do not run destructive migration checks on `tms_dev`. After
review, `npm run migration:run` explicitly targets the database in `.env`.

There are no migrations or business tables yet. An explicit `migration:run` may
create TypeORM's internal migration-history table even when no migrations are
pending. Do not add an empty initial migration merely to populate the directory.
Add `btree_gist` in the first migration that introduces an exclusion constraint
requiring it; no current constraint uses it.

## Checks

Run from `backend/`:

```bash
npm run lint
npm run typecheck
npm test -- --runInBand          # Unit/config tests do not require PostgreSQL
npm run build
DB_NAME=tms_test npm run db:check
DB_NAME=tms_test npm run test:e2e -- --runInBand
```

The existing HTTP E2E test initializes the real AppModule, including its database
connection; PostgreSQL and `tms_test` must be available. The connection is closed
with the Nest application. No E2E test runs migrations automatically.

Other existing commands:

```bash
npm run start:prod  # Run compiled application
npm run lint:fix    # Apply ESLint fixes explicitly
npm run format     # Format source and tests explicitly
```

## References

- [Backend conventions](../docs/code-style/backend.md)
- [Planned API contract](../docs/api/openapi.yaml)
- [Persistence design and open decisions](../docs/database/erd.md)
- [Git workflow](../CONTRIBUTING.md)
