// 240415 월 C팀 강정윤
const express = require("express");
const likeRouter = express.Router();
const { addLike, delLike } = require("../controller/LikeController");

likeRouter.use(express.json());

likeRouter.post("/:id", addLike); // 좋아요 추가
likeRouter.delete("/:id", delLike); // 좋아요 삭제

module.exports = likeRouter;
