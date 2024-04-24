// 240418 (목) C팀 강정윤
const express = require("express");
const orderRouter = express.Router();
const {
  order,
  viewOrders,
  viewOrderDetail,
} = require("../controller/OrderController");

orderRouter.use(express.json());

orderRouter.post("/", order); // 주문하기
orderRouter.get("/", viewOrders); // 주문 목록 조회
orderRouter.get("/:id", viewOrderDetail); // 주문 상세 상품 조회

module.exports = orderRouter;
