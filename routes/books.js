const express = require("express");
const bookRouter = express.Router();
const { allBooks, individualBook } = require("../controller/BookController");

bookRouter.use(express.json());

bookRouter.get("/", allBooks); // 전체 도서 조회 + 카테고리별 도서 조회
bookRouter.get("/:id", individualBook); // 개별 도서 조회

module.exports = bookRouter;
