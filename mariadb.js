// mysql2 module
const mariadb = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// DB연동
const connection = mariadb.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_TABLE,
  dateStrings: true,
});

// const connection = mariadb.createConnection({
//   host: "127.0.0.1",
//   port: "13306",
//   user: "root",
//   password: "root",
//   database: "Bookshop",
//   dateStrings: true,
// });

module.exports = connection;
