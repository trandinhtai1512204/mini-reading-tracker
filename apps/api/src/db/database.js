import mysql from 'mysql2/promise';

export function createDatabase(environment) {
  const pool = mysql.createPool({
    host: environment.MYSQL_HOST,
    port: environment.MYSQL_PORT,
    database: environment.MYSQL_DATABASE,
    user: environment.MYSQL_USER,
    password: environment.MYSQL_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
  });

  return {
    async ping() {
      await pool.query('SELECT 1 AS database_ready');
    },
    async close() {
      await pool.end();
    },
  };
}
