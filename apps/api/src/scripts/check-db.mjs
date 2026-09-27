import { loadEnvironment } from '../config/environment.js';
import { createDatabase } from '../db/database.js';

const database = createDatabase(loadEnvironment());

try {
  await database.ping();
  console.log('Database connection is ready.');
} finally {
  await database.close();
}
