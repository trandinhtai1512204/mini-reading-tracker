# Architecture decision — Session 00

## Chosen structure

```text
mini-reading-tracker/
├── apps/
│   ├── api/                  # Node.js + Express REST API (Session 01+)
│   └── web/                  # Vue 3 + Vite SPA (Session 04+)
├── docs/                     # Contracts and delivery decisions
├── scripts/                  # Repository-level verification utilities
├── .env.example              # Placeholder configuration only
└── package.json              # npm workspaces root
```

```text
Browser (Vue 3)
  └─ API client (VITE_API_BASE_URL)
       └─ Node/Express REST API
            ├─ request validation + error middleware
            ├─ library service ─── MySQL
            └─ OpenLibrary service ─── Open Library public API
```

## Decisions

| Concern | Decision | Why |
| --- | --- | --- |
| Package manager | npm workspaces | npm 11 is installed locally; two small workspaces remain easy to run and explain. |
| Web | Vue 3 + Vite | Meets the required Vue.js stack with a small development toolchain. |
| API | Node.js + Express | Express is a straightforward boundary for validation, business rules and upstream mapping. |
| Persistence | MySQL | Required durable source of truth for the personal library. |
| Validation | Backend owns it; a schema validator will be chosen in Session 01 | Every client receives the same rules and error shape. |
| Open Library | API service only | The browser never receives an upstream base URL or calls Open Library directly. |

## Scope boundary

This session intentionally contains no Express server, MySQL connection, migration, Vue screen, Open Library request, or library mutation. Those are sequenced in the runbook so each checkpoint remains independently reviewable.

## Local command plan

| Command | Current result | Introduced in |
| --- | --- | --- |
| `npm install` | Installs workspace dependencies once package dependencies are added in the implementation sessions. | Session 01 / 04 |
| `npm run check:foundation` | Verifies the Session 00 repository contract. | Session 00 |
| `npm run lint` | Currently aliases the structural check; real source linting is added with the first source workspace. | Session 01 |
| `npm run test` | Currently aliases the structural check; behavior tests begin with API rules. | Session 01 / 03 |
| `npm run dev:api` | Planned Express development server command. | Session 01 |
| `npm run dev:web` | Planned Vite development server command. | Session 04 |

No command is presented as a running application before its implementation session.
