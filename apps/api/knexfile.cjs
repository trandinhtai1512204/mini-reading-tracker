const path = require('node:path');
require('dotenv').config({
  path: process.env.ENV_FILE || path.resolve(__dirname, '../../.env'),
});

const connection = {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT ?? 3306),
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
};

module.exports = {
  development: {
    client: 'mysql2',
    connection,
    migrations: {
      directory: path.join(__dirname, 'migrations'),
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
  },
};
