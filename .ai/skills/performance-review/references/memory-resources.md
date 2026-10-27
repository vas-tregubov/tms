# Memory Resources

Trace ownership and release of DB, file, socket, stream, timer, and event-subscription resources across success, errors, cancellation, and unmount. Account for framework-managed cleanup.

Check long-lived closures retaining large objects, subscriptions without cleanup, unbounded caches, indefinitely growing globals, and browser/React or Node.js runtime-specific leak patterns. Allocation alone does not prove a leak: identify retained reachability or missing release.

Report location, retaining owner/resource, lifecycle trigger, growth, impact, and minimal cleanup/bound/eviction fix. State when heap profiles or runtime evidence are needed.
