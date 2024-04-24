// 240416 화 C팀 강정윤
const ensureAuthorization = require("../auth"); // 토큰 인증 모듈
const conn = require("../mariadb"); // db module
const { StatusCodes } = require("http-status-codes"); // status code module
const jwt = require("jsonwebtoken");

// 장바구니 담기 컨트롤러
const addCart = (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
      });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "잘못된 토큰입니다.",
      });
    }

    let sql =
      "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);";
    let values = [bookId, quantity, authorization.id];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

//240416 화 C팀 강정윤
// 장바구니 아이템 목록 조회 컨트롤러 + 선택한 장바구니 상품 목록 조회
const viewCartItems = (req, res) => {
  try {
    const { selected } = req.body; // selected는 배열

    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
      });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "잘못된 토큰입니다.",
      });
    }

    let sql = `SELECT cartItems.id, book_id AS bookId, title, summary, quantity, price 
              FROM cartItems LEFT JOIN books 
              ON cartItems.book_id = books.id
              WHERE user_id = ?`;
    let values = [authorization.id];

    // 주문서 작성 시 '선택한 장바구니 목록 조회'
    if (selected) {
      sql += ` AND cartItems.id IN (?)`;
      values.push(selected);
    }

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

// 장바구니 아이템 삭제 컨트롤러
const delCartItem = (req, res) => {
  try {
    let authorization = ensureAuthorization(req, res);

    if (authorization instanceof jwt.TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
      });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "잘못된 토큰입니다.",
      });
    }

    const cartItemId = req.params.id;

    let sql = "DELETE FROM cartItems WHERE id = ?";

    conn.query(sql, cartItemId, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      return res.status(StatusCodes.OK).json(results);
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

module.exports = { addCart, viewCartItems, delCartItem };
