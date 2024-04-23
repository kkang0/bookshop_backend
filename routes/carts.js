// 240416 화 C팀 강정윤
const express = require("express");
const router = express.Router();
const {
  addCart,
  viewCartItems,
  delCartItem,
} = require("../controller/CartController");

router.use(express.json());

router.post("/", addCart); // 장바구니 담기
router.get("/", viewCartItems); // 장바구니 아이템 목록 조회 + 선택한 장바구니 상품 목록 조회
router.delete("/:id", delCartItem); // 장바구니 도서 삭제

module.exports = router;
