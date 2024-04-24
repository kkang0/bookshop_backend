// 240416 화 C팀 강정윤
const express = require("express");
const cartRouter = express.Router();
const {
  addCart,
  viewCartItems,
  delCartItem,
} = require("../controller/CartController");

cartRouter.use(express.json());

cartRouter.post("/", addCart); // 장바구니 담기
cartRouter.get("/", viewCartItems); // 장바구니 아이템 목록 조회 + 선택한 장바구니 상품 목록 조회
cartRouter.delete("/:id", delCartItem); // 장바구니 도서 삭제

module.exports = cartRouter;
