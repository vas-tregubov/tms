# TMS Backend

NestJS/TypeScript scaffold with a sample `GET /` endpoint. Business modules,
PostgreSQL persistence and authentication are not implemented. The frontend
currently uses its own in-memory mock API.

## Commands

Run from the repository root after `npm run setup`:

```bash
npm --prefix backend run start:dev # Watch mode; default port 3000, override with PORT
npm --prefix backend run build     # Compile and typecheck
npm --prefix backend run start:prod # Run the compiled application
npm --prefix backend run lint      # Check without changes
npm --prefix backend run lint:fix  # Apply ESLint fixes
npm --prefix backend run format    # Format source and tests
npm --prefix backend test -- --runInBand
npm --prefix backend run test:e2e -- --runInBand
npm --prefix backend run test:cov -- --runInBand
```

The existing Jest suites cover the scaffold, not the planned business API.

## References

- [Backend conventions](../docs/code-style/backend.md)
- [Planned API contract](../docs/api/openapi.yaml)
- [Persistence design and open decisions](../docs/database/erd.md)
- [Git workflow](../CONTRIBUTING.md)
