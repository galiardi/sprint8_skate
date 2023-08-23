import mysql from 'mysql2';
import { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE } from './config.js';

const pool = mysql.createPool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
});

const promisePool = pool.promise();

export { promisePool };
