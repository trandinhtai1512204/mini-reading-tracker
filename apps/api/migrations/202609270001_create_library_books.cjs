exports.up = async function up(knex) {
  await knex.raw(`
    CREATE TABLE library_books (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      work_id VARCHAR(64) NOT NULL,
      title VARCHAR(500) NOT NULL,
      author VARCHAR(500) NULL,
      cover_id BIGINT UNSIGNED NULL,
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
      KEY library_books_status_idx (status),
      CONSTRAINT library_books_page_range_chk CHECK (current_page <= total_pages),
      CONSTRAINT library_books_rating_chk CHECK (rating IS NULL OR rating BETWEEN 1 AND 5)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('library_books');
};
