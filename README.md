# Mini Reading Tracker

An incremental implementation of the ICODE Fullstack test: search Open Library through a Node API, save a personal book collection in MySQL, and track reading progress in Vue.

## Current checkpoint

**Session 01 — API/database foundation.** Express exposes a database-backed health check, while Knex owns the MySQL migration and idempotent sample seed. Open Library, personal-library endpoints and the Vue UI are intentionally deferred.

## Stack and structure

- Frontend: Vue 3 + Vite (introduced in Session 04)
- Backend: Node.js + Express (introduced in Session 01)
- Database: MySQL (introduced in Session 01)
- Repository: npm workspaces (`apps/web` and `apps/api`)

See [architecture](docs/architecture.md), [API contract](docs/api-contract.md), [MySQL schema](docs/mysql-schema.md), and [PDF traceability](docs/requirements-traceability.md).

## Local setup at this checkpoint

Prerequisites: Node.js 20+, npm and a MySQL 8+ database.

```bash
npm install
cp .env.example .env
npm run db:check
npm run db:migrate
npm run db:seed
npm run dev:api
```

In another terminal, verify the API with `curl http://localhost:3001/api/health`. `.env.example` contains placeholders only; keep real credentials in ignored `.env`. The Vue development server arrives in Session 04.

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
| API health, migration and sample seed | Complete in Session 01; requires a MySQL instance to run locally |
| Open Library proxy and Vue features | Planned in Sessions 02–06 |
| Quality gate | Planned in Session 07 |
| Deployment handoff and public HTTPS smoke test | Planned in Sessions 08–09 |

Deployment has not been requested or performed for this checkpoint.
