# Mini Reading Tracker

An incremental implementation of the ICODE Fullstack test: search Open Library through a Node API, save a personal book collection in MySQL, and track reading progress in Vue.

## Current checkpoint

**Session 00 — project foundation and technical contract.** The repository now defines workspaces, safe configuration conventions, API/schema contracts and requirement traceability. It intentionally has no running product feature, database connection, Open Library call or Vue screen yet.

## Stack and structure

- Frontend: Vue 3 + Vite (introduced in Session 04)
- Backend: Node.js + Express (introduced in Session 01)
- Database: MySQL (introduced in Session 01)
- Repository: npm workspaces (`apps/web` and `apps/api`)

See [architecture](docs/architecture.md), [API contract](docs/api-contract.md), [MySQL schema](docs/mysql-schema.md), and [PDF traceability](docs/requirements-traceability.md).

## Local setup at this checkpoint

Prerequisites: Node.js 20+ and npm. MySQL is not needed until Session 01.

```bash
npm install
cp .env.example .env
npm run check:foundation
```

`.env.example` contains placeholders only. Keep real local credentials in `.env`, which is ignored by Git. The API and web development-server commands will be added only in their assigned sessions; do not treat this checkpoint as a working app.

## Architecture rules already agreed

1. The Vue frontend calls only the project API. Open Library is called and normalized server-side.
2. MySQL, not localStorage, is the source of truth for the personal library.
3. A database unique constraint on `work_id` is the final duplicate guard and maps to HTTP `409 Conflict`.
4. Backend rules validate progress/rating and own `READING`/`READ` timestamps and automatic completion.
5. Handled errors use one JSON envelope documented in the API contract.

## Delivery status

| Item | Status |
| --- | --- |
| Repository foundation and contracts | Complete in Session 00 |
| API/database, Open Library proxy and Vue features | Planned in Sessions 01–06 |
| Quality gate | Planned in Session 07 |
| Deployment handoff and public HTTPS smoke test | Planned in Sessions 08–09 |

Deployment has not been requested or performed for this checkpoint.
