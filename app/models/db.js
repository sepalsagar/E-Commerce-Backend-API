const mysql = require("mysql2/promise");
const dbConfig = require("../config/db.config");

const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: dbConfig.PORT,
  connectionLimit: dbConfig.CONNECTION_LIMIT,
  waitForConnections: true,
  queueLimit: 0,
});

module.exports = pool;
