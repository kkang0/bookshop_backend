// 240411 C팀 강정윤
const conn = require("../mariadb"); // db module
const { StatusCodes } = require("http-status-codes"); // status code module

// 카테고리 전체 도서 목록 조회 컨트롤러
const allCategory = (req, res) => {
  try {
    let sql =
      "SELECT category_id AS categoryID, category_name AS categoryName FROM category";

    conn.query(sql, (err, results) => {
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

module.exports = {
  allCategory,
};
