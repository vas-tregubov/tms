# Database

Check N+1, DB queries in loops, lazy loading, ORM property access triggering hidden queries, and unnecessary repeated queries. Confirm actual ORM behavior and existing preloading/batching; mocks do not establish DB query behavior.

For each issue give location, triggering path, expected query count for N records including initial queries, improved approach, and expected count after the fix. For chunked batching state batch-size dependence. Preserve authorization, pagination, ordering, and result semantics; discuss join/result-size or caching tradeoffs.
