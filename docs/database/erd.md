# TMS MVP persistence model

Design for Issue #177, not an implemented schema. One PostgreSQL database;
Controller → Service → Repository. No ORM, migrations or authentication tables
are selected here. Order and marketplace features are excluded.

The decisions supplied for Issue #177 supersede the older field shapes in
[the domain model](../domain-model.md) and [OpenAPI](../api/openapi.yaml).
Naming is `snake_case` in PostgreSQL and `camelCase` at the TypeScript/API boundary.

## ERD

The diagram shows physical FK cardinalities, including retained assignment rows.
See the constraints and membership sections for endpoint and composition invariants.

```mermaid
erDiagram
    drivers ||..o{ trips : assigned_driver
    vehicles ||..o{ trips : assigned_vehicle
    distribution_centers |o..o{ routes : start_dc
    distribution_centers |o..o{ routes : end_dc
    logistics_points |o..o{ routes : start_lp
    logistics_points |o..o{ routes : end_lp
    trips ||..o{ trip_routes : retains_memberships
    routes ||..o{ trip_routes : retains_assignments
    routes ||..o{ route_status_history : records
    trips ||..o{ trip_status_history : records

    drivers {
        uuid id PK
        text first_name
        text last_name
        text middle_name "nullable"
        text phone "unique while current"
        timestamptz archived_at "nullable"
    }
    vehicles {
        uuid id PK
        text registration_number "unique while current"
        text type
        integer max_weight_kg
        numeric max_volume_m3
        text status "no exhaustive enum"
        timestamptz archived_at "nullable"
    }
    distribution_centers {
        uuid id PK
        text name
        text address
        double_precision latitude "nullable pair"
        double_precision longitude "nullable pair"
        timestamptz archived_at "nullable"
    }
    logistics_points {
        uuid id PK
        text name
        text address
        double_precision latitude "nullable pair"
        double_precision longitude "nullable pair"
        text schedule
        text status "no exhaustive enum"
        timestamptz archived_at "nullable"
    }
    routes {
        uuid id PK
        text number UK
        date date
        uuid start_distribution_center_id FK "nullable XOR"
        uuid start_logistics_point_id FK "nullable XOR"
        uuid end_distribution_center_id FK "nullable XOR"
        uuid end_logistics_point_id FK "nullable XOR"
        time start_time "end-point acceptance window"
        time end_time "end-point acceptance window"
        text status
        text comment "nullable"
        jsonb start_point_snapshot
        jsonb end_point_snapshot
    }
    trips {
        uuid id PK
        text number UK
        uuid driver_id FK
        uuid vehicle_id FK
        timestamptz starts_at
        timestamptz ends_at
        text status
        text comment "nullable"
        jsonb driver_snapshot
        jsonb vehicle_snapshot
        timestamptz deleted_at "nullable erroneous Trip tombstone"
    }
    trip_routes {
        bigint id PK
        uuid trip_id FK
        uuid route_id FK "unique current assignment"
        integer position "unique current position per Trip"
        timestamptz assigned_at
        text assigned_by
        timestamptz released_at "nullable"
        text released_by "nullable"
        text release_reason "nullable"
    }
    route_status_history {
        bigint id PK
        uuid route_id FK
        text from_status "nullable initial event"
        text to_status
        timestamptz occurred_at
        text author
        text comment "nullable"
    }
    trip_status_history {
        bigint id PK
        uuid trip_id FK
        text from_status "nullable initial event"
        text to_status
        timestamptz occurred_at
        text author
        text comment "nullable"
    }
```

## Columns and constraints

Unless marked nullable, every column is `NOT NULL`. All FKs below reference the
named parent's `id`, use `ON DELETE RESTRICT`, and do not cascade business history.
Main-table `id` values are UUID PKs with server default `gen_random_uuid()`.
Auxiliary `bigint` PKs are generated identities. Unlisted columns have no default.
`number` is server-generated, globally unique within its own table, immutable and
never reused; use independent sequences for Route and Trip, not `max + 1`.
The `MR-` / `TR-` presentation format must not impose a six-digit lifetime limit.

| Table                  | Fields, PostgreSQL types and defaults                                                                                                                                                                                                                                                        | Additional constraints                                                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `drivers`              | `id uuid`; `first_name text`, `last_name text`, `phone text`; `middle_name text NULL`; `archived_at timestamptz NULL DEFAULT NULL`                                                                                                                                                           | Nonblank required names and phone. Partial UNIQUE `phone` where `archived_at IS NULL`. Names are not unique.                                                                 |
| `vehicles`             | `id uuid`; `registration_number text`, `type text`, `status text`; `max_weight_kg integer`; `max_volume_m3 numeric` (no fixed scale yet); `archived_at timestamptz NULL DEFAULT NULL`                                                                                                        | Nonblank registration/type/status. Partial UNIQUE `registration_number` where `archived_at IS NULL`. No status default or exhaustive enum is approved.                       |
| `distribution_centers` | `id uuid`; `name text`, `address text`; `latitude double precision NULL`, `longitude double precision NULL`; `archived_at timestamptz NULL DEFAULT NULL`                                                                                                                                     | Nonblank name/address. Coordinates are both absent or both present, latitude in [-90, 90], longitude in [-180, 180]. No name/address uniqueness.                             |
| `logistics_points`     | Same identity/name/address/coordinates/archive fields as Distribution Center; `schedule text`, `status text`                                                                                                                                                                                 | Same coordinate checks. No name/address uniqueness, structured schedule or exhaustive status enum. No status default.                                                        |
| `routes`               | `id uuid`; `number text UNIQUE`; `date date`; four nullable point UUID FKs shown above; `start_time time(0) without time zone`, `end_time time(0) without time zone`; `status text DEFAULT 'created'`; `comment text NULL DEFAULT NULL`; two point snapshots `jsonb`                         | Each endpoint has exactly one non-null FK. Status CHECK allows only `created`, `assigned`, `intransit`, `completed`. No invented transition graph.                           |
| `trips`                | `id uuid`; `number text UNIQUE`; `driver_id uuid FK drivers`, `vehicle_id uuid FK vehicles`; `starts_at timestamptz`, `ends_at timestamptz`; `status text DEFAULT 'assigned'`; `comment text NULL DEFAULT NULL`; two directory snapshots `jsonb`; `deleted_at timestamptz NULL DEFAULT NULL` | Finite timestamps with `ends_at > starts_at`. Same four status values. Scheduling exclusions below. `deleted_at` is not a new domain status.                                 |
| `trip_routes`          | `id bigint`; `trip_id uuid FK trips`, `route_id uuid FK routes`; `position integer`; `assigned_at timestamptz DEFAULT clock_timestamp()`, `assigned_by text`; `released_at timestamptz NULL DEFAULT NULL`, `released_by text NULL`, `release_reason text NULL`                               | `position > 0`; `released_at IS NULL OR released_at >= assigned_at`; released timestamp/actor/reason are either all absent or all present. Two partial UNIQUE indexes below. |
| `route_status_history` | `id bigint`; `route_id uuid FK routes`; `from_status text NULL`, `to_status text`; `occurred_at timestamptz DEFAULT clock_timestamp()`; `author text`; `comment text NULL DEFAULT NULL`                                                                                                      | Existing four status values only; `from_status IS NULL` identifies initial creation. Append-only server facts, not UI marker states.                                         |
| `trip_status_history`  | Same history fields, with `trip_id uuid FK trips` instead of `route_id`                                                                                                                                                                                                                      | Same status checks and append-only policy.                                                                                                                                   |

Coordinates are optional as confirmed in #225: API absence is a null pair,
with no partial pair allowed. Whether coordinates must be required before
planning remains open.
Reject nonfinite numeric capacity values. Capacity positivity, zero, maximum
bounds and volume scale still require a business decision; integer kg and decimal
m³ are the agreed units, not a load-feasibility algorithm. Store times at minute
precision (seconds zero, hours 00–23); do not compare Route `end_time` to
`start_time` until overnight-window semantics are approved. Route times concern
the **acceptance/service window at the end point**, not vehicle movement.

Phone and registration uniqueness applies to canonical stored values among
unarchived rows. Normalization must be agreed before implementation; raw text
uniqueness alone cannot prevent equivalent formatted values. Archiving does not
change the UUID or existing Trip links. No permanent Driver ↔ Vehicle relation
exists. A Driver is not an authentication account.

Snapshot columns must contain JSON objects, never SQL/JSON null or arrays.
Their small, server-built shapes are specified below; field validation is part
of the write transaction, not a substitute for the real directory FKs.

## Relationships and membership history

Driver → Trip and Vehicle → Trip are 1:N; each Trip has exactly one of each.
Each directory point can be used by many Route endpoints. Four actual FKs and
an XOR CHECK per endpoint allow DC→DC, DC→LP, LP→DC and LP→LP without a
polymorphic ID that PostgreSQL cannot validate. Translate API `{ type, id }`
references into those columns; no extra common-point entity is needed.

Route ↔ Trip is N:M **over assignment history**, via `trip_routes`. Currently a
Route has zero or one unreleased membership; a Trip has one or more, except a
deleted erroneous Trip. A Route can exist without any assignment history.

- Partial UNIQUE `(route_id) WHERE released_at IS NULL` prevents two current
  Trips and duplicate membership in the same Trip, including concurrent inserts.
- Partial UNIQUE `(trip_id, position) WHERE released_at IS NULL` ensures a
  deterministic current execution order. Positions need not be contiguous.
- No unconditional UNIQUE `(trip_id, route_id)`: a Route may leave and later
  return, producing another historical row.
- Read current composition using `released_at IS NULL`, ordered by `position`.
  Completed membership remains unreleased to preserve completed composition;
  “current membership” does not mean the vehicle is still executing that Route.
- Detach closes the old row; transfer closes it and inserts a destination row
  in one transaction. Preserve the original Trip/Route IDs, assignment/release
  times and server-supplied actor labels. Do not delete historical rows.
- Reordering changes current positions under the Trip lock. Partial unique
  indexes cannot be deferred: use unused positive staging positions before the
  final order. This is assignment history, not a full audit of every reorder.

A FK/UNIQUE cannot enforce “each Trip has at least one current Route”. For the
MVP, enforce this in the service transaction, not a custom deferred trigger:
lock every affected Trip before changing memberships, apply the complete change,
then verify the final composition before commit. A non-deleted Trip must be
nonempty; a deleted Trip must have no current memberships. Concurrent removals
serialize on the parent Trip lock, so each check sees the preceding committed change.
Removing the final Route requires an allowed erroneous-Trip deletion in the same
transaction or a conflict. Do not silently keep an empty Trip.

This guarantee depends on every membership write using this transaction protocol;
FKs and partial UNIQUE indexes alone do not provide it. Direct SQL writes must
not bypass the service. Reconsider a deferred constraint trigger only if another
supported writer must enforce the same rule independently.

## Retention and minimal snapshots

Proposed policy: archive directory records using `archived_at`; physically delete
only never-referenced records. Archived entries cannot be selected for new
assignments/endpoints but remain resolvable from historical documents. Retain
completed Trips, Routes, membership rows and status histories. Only an erroneous
Trip deleted before execution receives `deleted_at`; normal lists/details treat
it as deleted, while internal history can still resolve its number and links.
No physical deletion of a Trip with history and no cascading deletion is needed.

**Assignment fixation requirement confirmed in #225.** Route data used when
assigning it to a Trip must remain historically fixed for that Trip even if the
source Route changes later. The exact Route assignment field set and storage
shape are not defined by the minimal directory snapshots below; that design
remains open. Existing frontend copies are temporary projections.

**Snapshot structure/capture policy proposal, pending approval.** The snapshot columns in the ERD
and table definitions represent this proposal, not an approved HTTP contract.
Copy only fields necessary to read a business document independently of later
reference-data edits. The proposed capture/freeze boundaries are:

| Owner | Snapshot                                                                                                     | Capture/update boundary                                                                                                                                                              |
| ----- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Route | `start_point_snapshot`, `end_point_snapshot`: `{ name, address }`                                            | Capture in the Route creation transaction; replace only on an allowed explicit endpoint change. Completion freezes the existing values without rereading the directory.              |
| Trip  | `driver_snapshot`: `{ firstName, lastName, middleName }`; `vehicle_snapshot`: `{ registrationNumber, type }` | Capture in the Trip creation transaction; replace only on an allowed explicit Driver/Vehicle reassignment. Completion freezes the existing values without rereading the directories. |

These are **as-recorded document labels**, not the latest directory values at
completion. A directory edit after creation does not refresh an unfinished
Route/Trip snapshot; editing an unrelated document field does not refresh it
either. Capture/replacement and the corresponding FK change commit atomically.
If completion-time directory values are required instead, that is a different
policy to approve before implementation. No separate completion snapshot or
snapshot trigger is proposed.

Optional `middleName` is represented as JSON null in a snapshot. UUID FKs identify
the original records; snapshots are not a second source of assignment identity.
Do not copy phone, capacity, availability status, coordinates or schedules: current
screens do not need their historical values. Do not copy full Route objects
into Trips: read retained membership rows and Route data. Completed Routes are
immutable, so their final state and point snapshots remain intact. Full temporal
versions of every editable Route field are outside this minimal design.

This is a proposed display/retention policy, not behavior already implemented in
the frontend. Historical search must use snapshot labels when matching the names
or registration displayed in Trips/Routes; renaming a directory must not make a
displayed historical value unsearchable.

Use row-locked service checks to reject mutation/deletion of completed Routes
and mutation, logical deletion or composition changes of completed Trips.
Keep history append-only through insert-only repository operations; a closed
membership must not be rewritten. Status changes and history inserts belong to
one transaction. No custom guard triggers are required for the MVP: they would
duplicate lifecycle rules and complicate changes to the still-open transition
policy. These rules are not guaranteed by CHECK/FK constraints against arbitrary
SQL writers; database-level hardening for additional writers remains a separate
decision. Retain database FK/NOT NULL/CHECK constraints, partial UNIQUE indexes
and scheduling exclusions for row integrity and concurrent uniqueness/overlap.

Do not add user/auth FKs before an authentication persistence design
exists: `author`, `assigned_by`, `released_by` are server-resolved display labels,
not trusted request data or durable user identifiers. Identity-level audit is an
explicit future decision, not a new user table here.

## Scheduling and transactions

Use full `starts_at`/`ends_at` instants for Trip intervals. Overnight and multi-day
Trips require no inferred end date. API input must supply offsets; display-zone
policy remains open. No separate duplicated Trip date/time columns are stored.

Proposed boundary convention: half-open `[starts_at, ends_at)` permits one Trip
to begin exactly when another ends. Confirm this convention before implementation.
Prevent overlaps using two GiST exclusion constraints on non-deleted Trips:

- `(driver_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)`
- `(vehicle_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)`

Both use the predicate `deleted_at IS NULL` and need PostgreSQL's `btree_gist`
extension for UUID equality. These constraints protect concurrent inserts and
schedule/resource updates, including future Trips; they are not just preflight
availability queries. Completed Trips retain their intervals and remain covered;
a deleted erroneous Trip releases its interval. No booking/reservation table or
expanded Vehicle status enum is necessary. These GiST indexes serve overlap
queries; they do not replace ordered B-tree list indexes. This task does not
install the extension or start PostgreSQL.

Every write below is one database transaction. Lock affected Trip rows in UUID
order, then Route rows in UUID order; use the same order for completion and
membership changes. Then lock relevant directory rows in a fixed table/UUID order
before checking that they are unarchived; archive operations must use the same directory locks.
A newly inserted Trip is already private to its creation transaction. If an
initial owner lookup changes while obtaining locks, retry with the correct
parent set before writing. After acquiring locks, reread current status/membership
rather than trusting frontend snapshots.

| Operation                      | Atomic work and checks                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create Route                   | Resolve and lock both point references, reject archived points, capture point snapshots, generate ID/number, insert `created` Route and initial history event.                                                                                                                                                                                                             |
| Create Trip                    | Resolve nonarchived Driver/Vehicle; insert the Trip; lock selected Routes, require a nonempty unique ordered selection of unassigned `created` Routes, insert memberships, set Routes and Trip to `assigned`, append initial/transition history, capture assignment snapshots. Exclusions reserve both resources; roll back everything on failure.                         |
| Detach/transfer                | Lock source/destination Trips and Route; verify eligibility before execution or the approved exceptional in-progress case. Reject completed Routes and completed/deleted destination Trips. Close the old membership, optionally insert the destination membership, adjust statuses/history as allowed, and validate both final compositions in the service before commit. |
| Delete erroneous Trip          | Only before execution under the approved eligibility rule: lock Trip and all current Routes, close memberships, release Routes, write corresponding history, set `deleted_at`. No Trip/Route is physically removed. Booking exclusions no longer reserve that interval.                                                                                                    |
| Change status                  | Lock the affected resource and membership parents when needed; validate the approved transition, update current status and insert a server-timestamped event together. A Route status change does not derive a Trip status.                                                                                                                                                |
| Change schedule/Driver/Vehicle | Lock Trip, reject completed/deleted Trip, check nonarchived references, refresh only changed assignment snapshots, update full timestamps/FKs; exclusions reject overlapping bookings.                                                                                                                                                                                     |

Release means the Route disappears from the old current composition immediately
on commit. A successful transfer sets its assignment status to `assigned`.
Releasing a not-yet-started Route to the available pool restores `created`, with
an actual history event. The exact status treatment of a partially executed
Route released without immediate reassignment is **not approved**: return a
conflict until decided, rather than silently reset execution progress. The
conditions/required reason for an exceptional in-progress transfer and the
remainder of the status transition graph are also open.

Map assignment-uniqueness and scheduling-exclusion violations to a predictable
409 business conflict without leaking constraint names. Deadlocks/serialization
failures require rollback and bounded retry or a retryable conflict; never report
success after partial work. UUIDs and numbers may have harmless allocation gaps.

## Indexes tied to current reads

PK and UNIQUE/exclusion constraints already create their supporting indexes;
do not duplicate them. Add only the following access paths when implementing:

| Index                                                                             | Query or invariant                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Partial unique Driver phone / Vehicle registration                                | Current-directory uniqueness and exact canonical lookup; no unique names.                                                                                                                                                                         |
| Existing UNIQUE `routes.number` / `trips.number` B-tree indexes, scanned backward | Preserve OpenAPI `number DESC, id ASC`. Numbers are unique, so the ID tie-breaker has no equal-number rows. Filter deleted Trips and date/status conditions without changing the requested order. No duplicate sorting index is needed initially. |
| `trip_routes (trip_id, position) WHERE released_at IS NULL` UNIQUE                | Current ordered composition and count; also serializes position claims.                                                                                                                                                                           |
| `trip_routes (route_id) WHERE released_at IS NULL` UNIQUE                         | Current owner lookup and prevention of double assignment.                                                                                                                                                                                         |
| `trip_routes (trip_id, assigned_at, id)` and `(route_id, assigned_at, id)`        | Assignment history, prior-owner lookup and FK reference checks even after release.                                                                                                                                                                |
| Each history table `(route_id/trip_id, occurred_at, id)`                          | Ordered, paginated status history and FK checks.                                                                                                                                                                                                  |
| Four nullable Route point FK indexes, each `WHERE column IS NOT NULL`             | Find referencing Routes for point archive/delete checks without scanning all Routes.                                                                                                                                                              |
| Two Trip resource GiST exclusion indexes                                          | Driver/Vehicle interval-overlap queries for non-deleted bookings.                                                                                                                                                                                 |
| `trips (driver_id)` and `trips (vehicle_id)`                                      | Find all referencing Trips, including deleted tombstones, for directory delete/FK checks; partial booking indexes do not cover tombstones.                                                                                                        |

Keep the list ordering specified in the index table above; do not substitute
date or numeric-suffix order. Date/status filtering may scan more index entries.
Add a composite filter/order index only after measuring the concrete query; a date-first index
must not silently change result ordering.

Current substring search is case-insensitive over Route number/point names and
Trip number/Driver name/Vehicle registration. Initial MVP search may scan the
filtered result set, using frozen display labels where applicable. Ordinary
B-tree indexes do **not** accelerate arbitrary `%substring%` searches. Do not add
trigram/JSONB indexes, capacity indexes, status-only indexes or directory-name
indexes without a measured query need. Directory lists can initially sort small
results by name/registration plus ID. No separate index is needed for a plain
current Driver ↔ Vehicle relation because no such relation exists.

## Open decisions and integration differences

- **Driver:** #225 uses required `firstName`, `lastName`, `phone` and optional
  `middleName` (API response null when absent), with derived display names. Phone canonicalization and current-directory reuse after
  archive need an explicit input policy. Do not split existing names heuristically.
- **Vehicle:** #225 names API fields `maxWeightKg` (integer kg) and
  `maxVolumeM3` (decimal m³). Choose numeric bounds/scale, registration normalization,
  initial availability and allowed status changes. `available` is only a fixture
  value; status is an eligibility flag, not the time-based booking calendar.
- **Points:** #225 uses optional numeric latitude/longitude pairs and free-text
  LP `schedule`. Which status permits new use remains open.
- **Route window:** retain API `startTime`/`endTime` acceptance-window semantics.
  Decide business zone, overnight
  window/date interpretation and minute precision at the API boundary.
- **Trip interval:** current `date` plus two `HH:mm` fields cannot express multi-day
  work. Evolve API/forms to offset-bearing full `startsAt`/`endsAt`; decide display
  zone and date-filter semantics. No midnight inference or automatic optimization.
- **Membership:** current frontend/OpenAPI lacks transfer/edit/delete flow; mocks
  embed temporary Route copies. #225 removes the contradictory initial membership
  of the free `route-002`; real membership reads remain a persistence integration task.
  Define execution-start evidence, exceptional transfer eligibility, standalone
  release of partially executed Routes and empty-source-Trip handling. Until
  approved, reject uncertain cases with 409; never move a completed Route.
- **History/retention:** approve the archive/tombstone and minimal snapshot proposal,
  its capture/freeze boundaries and historical search behavior, and the
  `[start,end)` booking convention. OpenAPI list sorting remains unchanged.
  Additional-writer database guards, general lost-update/version semantics and durable actor identity are
  still open. Whether a Trip may complete while one of its retained Routes is
  still editable must be decided: these directory snapshots do not freeze all
  Route fields inside a completed Trip, and no automatic status propagation is
  assumed. Deletion of an unfinished standalone Route is not decided; reject
  it until a retention rule exists rather than erase append-only history. Do not
  equate UI timeline marker states with stored status events.
- **Contract:** OpenAPI currently leaves scheduling/deletion policies provisional,
  retains the legacy Trip interval until timezone/date-filter decisions, and does
  not yet expose the proposed retention/snapshot storage policy. #225 synchronizes
  approved directory fields and RFC 3339 history; a persistence proposal does not
  silently amend HTTP DTOs or require UUID-shaped mock IDs.

Sources inspected: [frontend entity types](../../frontend/src/entities/),
[Route mock storage](../../frontend/src/entities/route/api/mockRouteSource.ts),
[Trip mocks](../../frontend/src/entities/trip/api/mockTrips.ts),
[Trip creation](../../frontend/src/features/create-trip/api/createTripApi.ts),
[Route validation](../../frontend/src/entities/route/lib/validateRouteFormStep.ts),
[Trip validation](../../frontend/src/features/create-trip/lib/validation.ts),
[domain model](../domain-model.md), and [OpenAPI](../api/openapi.yaml).

PostgreSQL references: [constraints](https://www.postgresql.org/docs/current/ddl-constraints.html),
[range exclusions](https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRAINT),
[btree_gist UUID support](https://www.postgresql.org/docs/current/btree-gist.html).
Diagram syntax: [Mermaid ERD](https://mermaid.js.org/syntax/entityRelationshipDiagram.html).
