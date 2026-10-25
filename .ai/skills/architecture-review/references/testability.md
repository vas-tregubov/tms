# Testability

Inspect hard dependencies; direct network/file/DB/time/random access inside logic; relevant static/singleton coupling; and missing test seams. Check existing project patterns and test controls before claiming difficulty.

Tie findings to concrete behavior that cannot reasonably be tested deterministically. Give location, impact, and smallest seam, such as a pure calculation or an existing collaborator passed explicitly. Do not require dependency injection for an easily tested simple function or create interfaces/wrappers for every implementation detail.
