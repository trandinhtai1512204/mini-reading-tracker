exports.seed = async function seed(knex) {
  await knex('library_books')
    .insert([
      {
        work_id: '/works/OL45804W',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        cover_id: 8231856,
        publish_year: 1813,
        total_pages: 432,
        current_page: 0,
        status: 'WANT_TO_READ',
        note: 'Sample book: planned reading.',
      },
      {
        work_id: '/works/OL27448W',
        title: 'The Little Prince',
        author: 'Antoine de Saint-Exupéry',
        cover_id: 10521270,
        publish_year: 1943,
        total_pages: 96,
        current_page: 36,
        status: 'READING',
        started_at: new Date('2026-09-20T09:00:00Z'),
        note: 'Sample book: currently reading.',
      },
      {
        work_id: '/works/OL116808W',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        cover_id: 7222246,
        publish_year: 1925,
        total_pages: 192,
        current_page: 192,
        status: 'READ',
        rating: 5,
        finished_at: new Date('2026-09-18T18:00:00Z'),
        note: 'Sample book: completed.',
      },
    ])
    .onConflict('work_id')
    .ignore();
};
