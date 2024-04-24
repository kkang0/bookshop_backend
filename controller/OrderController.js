// 240419 (금) C팀 강정윤
const ensureAuthorization = require("../auth"); // 토큰 인증 모듈
const jwt = require("jsonwebtoken");
const mariadb = require("mysql2/promise");
const { StatusCodes } = require("http-status-codes"); // status code module

// 주문하기 컨트롤러
const order = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    port: "13306",
    user: "root",
    password: "root",
    database: "Bookshop",
    dateStrings: true,
  });

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

  const { items, delivery, totalQuantity, totalPrice, mainBookTitle } =
    req.body;

  // delivery table INSERT
  let sql =
    "INSERT INTO delivery (address, recipient, contact) VALUES (?, ?, ?)";
  let values = [delivery.address, delivery.recipient, delivery.contact];

  let [results] = await conn.execute(sql, values);
  let delivery_id = results.insertId;

  // orders table INSERT
  sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
              VALUES (?, ?, ?, ?, ?)`;
  values = [
    mainBookTitle,
    totalQuantity,
    totalPrice,
    authorization.id,
    delivery_id,
  ];

  [results] = await conn.execute(sql, values);
  let order_id = results.insertId;

  // items 배열에서 book_id, quantity를 cartItems에서 가져오기
  sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
  let [orderItems, fields] = await conn.query(sql, [items]);

  // orderedBook table INSERT
  sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`;

  // orderItems 배열에서 꺼내 넣어주기
  values = [];
  orderItems.forEach((item) => {
    values.push([order_id, item.book_id, item.quantity]);
  });

  results = await conn.query(sql, [values]);

  // 장바구니 삭제 호출
  let result = await delCartItems(conn, items);

  return res.status(StatusCodes.OK).json(result[0]);
};

// 장바구니 cartItem 삭제
const delCartItems = async (conn, items) => {
  let sql = `DELETE FROM cartItems WHERE id IN (?)`;

  let result = await conn.query(sql, [items]);

  return result;
};

// 주문 목록 조회 컨트롤러
const viewOrders = async (req, res) => {
  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    port: "13306",
    user: "root",
    password: "root",
    database: "Bookshop",
    dateStrings: true,
  });

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

  let loginUserId = authorization.id;

  let sql = `SELECT orders.id, created_at AS createdAt, address, recipient, contact, 
              book_title AS bookTitle, total_quantity AS totalQuantity, total_price AS totalPrice
              FROM orders LEFT JOIN delivery ON orders.delivery_id = delivery.id
              WHERE user_id=?`;
  let [rows, fields] = await conn.query(sql, loginUserId);

  return res.status(StatusCodes.OK).json(rows);
};

// 주문 상세 조회 컨트롤러
const viewOrderDetail = async (req, res) => {
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

  const orderId = req.params.id; // order id 받아오기

  const conn = await mariadb.createConnection({
    host: "127.0.0.1",
    port: "13306",
    user: "root",
    password: "root",
    database: "Bookshop",
    dateStrings: true,
  });

  let sql = `SELECT book_id AS bookId, title, author, price, quantity
              FROM orderedBook LEFT JOIN books ON orderedBook.book_id = books.id
              WHERE order_id = ?`;
  let [rows, fields] = await conn.query(sql, [orderId]);

  return res.status(StatusCodes.OK).json(rows);
};

module.exports = { order, viewOrders, viewOrderDetail };
