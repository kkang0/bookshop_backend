//240411 C팀 강정윤
const express = require("express");
const categoryRouter = express.Router();
const { allCategory } = require("../controller/CategoryController");

categoryRouter.use(express.json());

categoryRouter.get("/", allCategory); // 카테고리 전체 도서 목록 조회

module.exports = categoryRouter;
