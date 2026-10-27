# Api Contract

Compare API specification and implementation: endpoints/methods, request/response schemas, naming, errors/status codes, internal data leakage, versioning, breaking changes, and documentation drift.

Cite both specification and implementation plus affected consumers. Determine which side may be stale before asserting a fix. If no specification exists, mark formal comparison not verified; label consumer-inferred contracts as inferred rather than inventing a spec.

Assess compatibility and migrations for actual consumers in scope. Do not demand versioning infrastructure for hypothetical clients.
