// 240415 월 C팀 강정윤
const ensureAuthorization = require("../auth"); // 토큰 인증 모듈
const jwt = require("jsonwebtoken");
const conn = require("../mariadb"); // db module
const { StatusCodes } = require("http-status-codes"); // status code module

// 좋아요 추가 컨트롤러
const addLike = (req, res) => {
  const book_id = req.params.id;

  let authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  }

  let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
  let values = [authorization.id, book_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

// 좋아요 삭제 컨트롤러
const delLike = (req, res) => {
  const book_id = req.params.id;

  let authorization = ensureAuthorization(req);

  if (authorization instanceof jwt.TokenExpiredError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.",
    });
  } else if (authorization instanceof jwt.JsonWebTokenError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 토큰입니다.",
    });
  }

  let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?";
  let values = [authorization.id, book_id];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    return res.status(StatusCodes.OK).json(results);
  });
};

module.exports = {
  addLike,
  delLike,
};
