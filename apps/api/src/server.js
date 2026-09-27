import { createApp } from './app.js';
import { loadEnvironment } from './config/environment.js';
import { createDatabase } from './db/database.js';

const environment = loadEnvironment();
const database = createDatabase(environment);
const app = createApp({ database });

const server = app.listen(environment.API_PORT, () => {
  console.log(`Reading Tracker API listening on port ${environment.API_PORT}.`);
});

async function shutDown(signal) {
  console.log(`${signal} received; closing API server.`);
  server.close(async () => {
    await database.close();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutDown('SIGINT'));
process.on('SIGTERM', () => void shutDown('SIGTERM'));
