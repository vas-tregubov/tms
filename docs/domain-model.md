# Domain Model

## Distribution Center

- `id`: string
- `name`: string
- `address`: string
- `latitude`: number (optional; paired with longitude)
- `longitude`: number (optional; paired with latitude)

Coordinates are optional for both directory types. Latitude and longitude are
supplied or cleared together; partial pairs are invalid. API responses always
include both fields, using `null` for an absent pair. Latitude is within [-90, 90]
and longitude within [-180, 180]. Coordinate requirement before planning remains
open; no geocoding or real-address validation is implied.

## Logistics Point

- `id`: string
- `name`: string
- `address`: string
- `latitude`: number (optional; paired with longitude)
- `longitude`: number (optional; paired with latitude)
- `schedule`: string
- `status`: string

## Trip

- `id`: string
- `number`: string
- `date`: string
- `routes`: Route[]
- `driver`: Driver
- `vehicle`: Vehicle
- `startTime`: string
- `endTime`: string
- `status`: TripStatus
- `comment`: string (optional, nullable at API boundary)

Trip `id` is the technical opaque identifier used for routing and lookups.
Trip `number` is its independent business/display number, for example `TR-000123`.
`comment` is an optional Trip note.

## Route

- `id`: string
- `number`: string
- `date`: string
- `startPoint`: DistributionCenter | LogisticsPoint
- `endPoint`: DistributionCenter | LogisticsPoint
- `startTime`: string
- `endTime`: string
- `comment`: string (optional, nullable at API boundary)
- `status`: RouteStatus

`id` is the technical opaque identifier used for routing and lookups.
`number` is the business/display number shown in the UI, for example `MR-000123`.
These values are independent; neither is derived from the other.

## Driver

- `id`: string
- `firstName`: string
- `lastName`: string
- `middleName`: string (optional)
- `phone`: string

Names are not unique. Do not store a duplicate `fullName`; format the name for the
UI from its parts. API responses include `middleName: null` when absent; PATCH
omission retains it and explicit `null` clears it. Search uses all name parts;
the directory sorts by last name, first name, middle name (missing first), then ID.
Phone canonicalization and directory uniqueness input policy remain open.

## Vehicle

- `id`: string
- `registrationNumber`: string
- `type`: string
- `maxWeightKg`: integer (kilograms)
- `maxVolumeM3`: number (cubic metres; fractions allowed)
- `status`: string

Vehicle capacity units are fixed; bounds, volume scale and registration
normalization remain open. Vehicle and Logistics Point statuses remain strings;
`available` and `active` in fixtures are not exhaustive enums.

## Route and Trip Statuses

Both use `created`, `assigned`, `intransit`, `completed`. New Routes are `created`;
new saved Trips and their selected `created` Routes become `assigned` atomically.
The full transition graph is not approved. Trip status is not automatically
derived from Route statuses. Generic UI styles do not own these domain contracts.

## Route Acceptance Window

Route `date` is a calendar date. `startTime` and `endTime` are minute-precision
`HH:mm` boundaries of the vehicle acceptance/service window at the end point,
not departure/arrival times or ETA. Timezone and overnight interpretation remain
open; no duration or start/end ordering rule is inferred.

Route point IDs belong to independent directories and may overlap. HTTP
`PointReference` therefore retains `{ type, id }`, with type `distribution-center`
or `logistics-point`. Current mock commands use internal directory objects, not
HTTP DTOs; preserve this boundary until transport integration.

## Trip Interval Migration

The persistence target uses offset-bearing `startsAt` and `endsAt`, with
`endsAt > startsAt`, for overnight and multi-day Trips. This migration is blocked
on the business/display timezone and date-filter semantics. Until approved, keep
the existing `date`, `startTime`, `endTime` fields together across forms, mocks and
API. Do not infer a scheduling timezone from the dispatcher's computer or a mock
status event's offset. Current Trip date filters retain their calendar-date behavior.

## Trip Route Composition

A Route has at most one current Trip assignment; a non-deleted Trip has one or
more Routes in execution order. The ordered `routeIds` create input uses technical
IDs. Assignment and status changes occur only after successful Trip persistence,
not while selecting Routes in a local draft.

Route data used at assignment must remain historically fixed for that Trip;
later source Route edits must not rewrite that information. The exact retained
field set and capture/storage schema remain unresolved: the ERD's minimal
snapshot columns are proposals and do not yet define an assignment snapshot.
Current nested Route copies are temporary mock projections, not another
independent authoritative Route store or a complete historical contract. No
transfer/release workflow or new editing prohibition is introduced here.

## Status History

Route and Trip history responses contain recorded server facts:

- `status`: the corresponding Route or Trip status;
- `occurredAt`: RFC 3339 timestamp with UTC `Z` or explicit offset;
- `author`: server-resolved display label, not a Driver identity;
- `comment`: optional string, nullable at the API boundary.

Visual timeline states and date formatting are computed in presentation code.
Fixed mock event offsets preserve fictional recorded wall times; they do not
establish the Trip scheduling timezone. Presentation displays each event's
recorded wall time without implicit browser-timezone conversion.

Mock histories remain intentionally sparse: mutations do not automatically build
an audit log, and existing records without a mock entry return an empty history.
Unknown resource IDs still return 404. This fallback does not change the future
server requirement to record initial events. PostgreSQL `from_status`/`to_status`
and history IDs need not be copied literally into the HTTP projection.

## Optional Comments and PATCH

Route/Trip comments may be absent or null. In PATCH, omission leaves a value
unchanged; explicit null clears a nullable value. Form blanks map to null when
clearing a note. Forms may submit all editable fields, but the Route mock update
also preserves fields omitted from a partial update.

## Order

- `id`: string
- `date`: string
- `startPoint`: DistributionCenter | LogisticsPoint
- `endPoints`: (DistributionCenter | LogisticsPoint)[]
- `weight`: number
- `volume`: number (optional)
- `status`: string
