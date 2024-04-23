// 240412 금 C팀 강정윤
const ensureAuthorization = require("../auth"); // 토큰 인증 모듈
const jwt = require("jsonwebtoken");
const conn = require("../mariadb"); // db module
const { StatusCodes } = require("http-status-codes"); // status code module

// 전체 도서 조회 컨트롤러 + 카테고리별 도서 조회 + 신간 조회 + 페이징 컨트롤러
const allBooks = (req, res) => {
  let allBooksRes = {};
  let { category_id, newBook, limit, curPage } = req.query;

  // limit: 한 페이지에 나타낼 도서의 수
  // curPage: 현재 몇 페이지 인지
  let offset = limit * (curPage - 1);

  let sql =
    "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books";
  let values = [];

  // 카테고리 id가 queryString으로 들어오면
  if (category_id && newBook) {
    sql +=
      " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    values.push(category_id);
  } else if (category_id) {
    sql += " WHERE category_id = ?";
    values.push(category_id);
  } else if (newBook) {
    sql +=
      " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
  }

  sql += " LIMIT ? OFFSET ?";
  values.push(parseInt(limit), offset);

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      // return res.status(StatusCodes.BAD_REQUEST).end();
    }

    console.log(results);

    if (results.length) allBooksRes.books = results;
    else return res.status(StatusCodes.NOT_FOUND).end();
  });

  sql = "SELECT found_rows() AS found";
  conn.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    console.log(results);

    let pagination = {};
    pagination.curPage = parseInt(curPage);
    pagination.totalCount = results[0].found;
    // pagination.totalCount = results[0]["found"];

    allBooksRes.pagination = pagination;

    return res.status(StatusCodes.OK).json(allBooksRes);
  });
};

// 240412 금 C팀 강정윤 -> LEFT JOIN
// 개별 도서 조회 컨틀롤러
const individualBook = (req, res) => {
  // 로그인 상태가 아니면 => liked 제외하고 sql 보내기
  // 로그인 상태면 => likded 추가해서 sql 보내기
  let authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  } else if (authorization === undefined) {
    // 로그인이 되어있지 않으면 liked를 제외하고 보내줌
    let book_id = req.params.id;

    let sql = `SELECT *,
                (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes
              FROM books 
              LEFT JOIN category 
              ON books.category_id = category.category_id
              WHERE books.id=?`;
    let values = [book_id];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      if (results[0]) return res.status(StatusCodes.OK).json(results[0]);

      // 존재 X
      return res.status(StatusCodes.NOT_FOUND).end();
    });
  } else {
    let book_id = req.params.id;
    let sql = `SELECT *,
                  (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                  (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
                FROM books 
                LEFT JOIN category 
                ON books.category_id = category.category_id
                WHERE books.id=?`;
    let values = [authorization.id, book_id, book_id]; // 2: liked_bookd_id

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      if (results[0]) return res.status(StatusCodes.OK).json(results[0]);

      // 존재 X
      return res.status(StatusCodes.NOT_FOUND).end();
    });
  }
};

module.exports = {
  allBooks,
  individualBook,
};
