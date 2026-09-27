# Proposed MySQL schema

The executable migration is `apps/api/migrations/202609270001_create_library_books.cjs`; this document remains its readable schema contract.

```sql
CREATE TABLE library_books (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  work_id VARCHAR(64) NOT NULL,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(500) NULL,
  cover_id BIGINT NULL,
  cover_url VARCHAR(1024) NULL,
  publish_year SMALLINT UNSIGNED NULL,
  total_pages INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('WANT_TO_READ', 'READING', 'READ') NOT NULL DEFAULT 'WANT_TO_READ',
  current_page INT UNSIGNED NOT NULL DEFAULT 0,
  rating TINYINT UNSIGNED NULL,
  note VARCHAR(1000) NULL,
  started_at DATETIME NULL,
  finished_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY library_books_work_id_uq (work_id),
  CONSTRAINT library_books_page_range_chk CHECK (current_page <= total_pages),
  CONSTRAINT library_books_rating_chk CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)
);
```

## Rule ownership

- The unique key is the final duplicate guard; its collision is mapped to HTTP `409 Conflict`.
- Backend validation also checks `0 <= currentPage <= totalPages` before writing, so the API returns a clear error instead of relying on a database constraint.
- The backend owns transitions: the first transition to `READING` sets `started_at`; `current_page = total_pages` or an explicit `READ` transition sets `finished_at` and status `READ`.
- `total_pages = 0` can exist when the upstream omits pages. Session 03 will define a clear mutation policy for such a book before allowing progress updates.

## Snapshot rationale

`title`, author, cover, publication year and total pages are saved as a library snapshot. The personal collection must remain readable even when Open Library changes, is incomplete or unavailable.
