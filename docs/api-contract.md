# Preliminary REST API contract

Base path: `/api`. The actual Express routes are introduced in later sessions; this is the contract that they must implement.

## Error envelope

Every handled API error returns JSON in this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "currentPage must be between 0 and totalPages.",
    "details": [
      { "field": "currentPage", "rule": "range", "message": "Must be between 0 and 320." }
    ]
  }
}
```

`details` is optional. The HTTP status remains meaningful: `400` invalid request, `404` unknown resource, `409` duplicate library work, `422` valid JSON that violates a reading rule, `502` invalid/upstream response, and `504` upstream timeout.

## Proposed resources

| Method | Path | Session | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | 01 | Verify API and database readiness. |
| `GET` | `/books/search?keyword=&page=` | 02 | Server-side Open Library search, normalized for Vue. |
| `GET` | `/books/:workId` | 02 | Server-side Open Library work detail, normalized for Vue. |
| `GET` | `/library-books?status=` | 03 | List saved books, optionally filtered. |
| `GET` | `/library-books/stats` | 03 | Return total, reading and read counts. |
| `POST` | `/library-books` | 03 | Save a snapshot of a work; duplicate `workId` returns `409`. |
| `PATCH` | `/library-books/:id` | 03 | Update status, current page, rating and/or note using backend rules. |
| `DELETE` | `/library-books/:id` | 03 | Remove one saved book. |

## Health response

`GET /api/health` is implemented in Session 01. It runs a lightweight database query and only reports ready when MySQL responds.

```json
{
  "data": {
    "status": "ok",
    "database": "connected"
  }
}
```

If the database is unavailable, it returns HTTP `503` and the standard `DATABASE_UNAVAILABLE` error envelope without leaking connection details.

## DTO boundary

The search/detail service exposes a stable object rather than raw Open Library JSON:

```json
{
  "workId": "/works/OL123W",
  "title": "Example title",
  "authors": ["Example author"],
  "coverId": 123,
  "coverUrl": "https://covers.openlibrary.org/b/id/123-M.jpg",
  "firstPublishYear": 2020,
  "description": "Optional description",
  "numberOfPages": 320,
  "subjects": ["Fiction"]
}
```

`null` or an empty array is used where upstream metadata is unavailable; the Vue UI must render a fallback. Session 02 defines the exact pagination response after checking Open Library behavior.
