// 240418 (목) C팀 강정윤
const express = require("express");
const router = express.Router();
const {
  order,
  viewOrders,
  viewOrderDetail,
} = require("../controller/OrderController");

router.use(express.json());

router.post("/", order); // 주문하기
router.get("/", viewOrders); // 주문 목록 조회
router.get("/:id", viewOrderDetail); // 주문 상세 상품 조회

module.exports = router;
