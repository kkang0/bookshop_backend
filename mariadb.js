// mysql2 module
const mariadb = require("mysql2");

// DB연동
const connection = mariadb.createConnection({
  host: "127.0.0.1",
  port: "13306",
  user: "root",
  password: "root",
  database: "Bookshop",
  dateStrings: true,
});

module.exports = connection;
