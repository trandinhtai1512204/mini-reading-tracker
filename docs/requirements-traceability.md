# PDF requirement traceability

Source: `README.reading-tracker.pdf`. “Done” below means assigned and intentionally not yet implemented unless a later session marks it verified.

| PDF requirement | Planned session | Planned artifact / evidence |
| --- | --- | --- |
| Vue.js frontend | 04 | `apps/web`, router, API client and browser check. |
| Node.js backend | 01 | `apps/api`, Express setup and health test. |
| MySQL persistent library | 01 | Migration, connection config and idempotent seed. |
| Search by title/author | 02 + 04 | Backend proxy test and Vue search screen. |
| Search cards: cover/title/author/year | 04 | Search component and browser evidence. |
| Search pagination | 02 + 04 | Normalized API pagination and UI controls. |
| Loading/no-result/error states | 04 | Search state tests/browser check. |
| Book detail fields | 02 + 05 | Detail DTO and detail screen/modal. |
| Initial status when adding | 03 + 05 | Add API validation and UI control. |
| Added badge | 04 + 05 | Library-derived state and post-add refresh. |
| Three library status tabs and stats | 03 + 06 | List/stats API and library view. |
| Progress, status, rating, note, confirmed delete | 03 + 06 | Mutation API tests and browser flows. |
| No direct frontend Open Library calls | 02 + 04 | Server-only upstream service and code review. |
| Duplicate add returns 409 | 03 | Unique index, controller mapping and test. |
| Progress/rating validation | 03 | Schema validation and edge-case tests. |
| Auto Read and timestamps | 03 | Transaction/rule tests. |
| Unified backend error format | 01 | Error middleware and API tests. |
| Public HTTPS deploy + 7-day stability | 08 + 09 | Docker/deploy checklist and live smoke-test record. |
| Seed data | 01 | Idempotent seed command and proof. |
| README/screenshots/API/deployment disclosure | 08 | Submission-ready README and artifacts. |
| No committed secrets | 00 + 08 | `.gitignore`, examples-only config and tracked-file audit. |
