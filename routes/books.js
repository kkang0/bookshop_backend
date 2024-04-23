const express = require("express");
const router = express.Router();
const { allBooks, individualBook } = require("../controller/BookController");

router.use(express.json());

router.get("/", allBooks); // 전체 도서 조회 + 카테고리별 도서 조회
router.get("/:id", individualBook); // 개별 도서 조회

module.exports = router;
