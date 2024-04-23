// 240415 월 C팀 강정윤
const express = require("express");
const router = express.Router();
const { addLike, delLike } = require("../controller/LikeController");

router.use(express.json());

router.post("/:id", addLike); // 좋아요 추가
router.delete("/:id", delLike); // 좋아요 삭제

module.exports = router;
