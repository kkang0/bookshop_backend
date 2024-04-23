const express = require("express"); // express module
const router = express.Router();
const conn = require("../mariadb"); // db module
const {
  join,
  login,
  passwordRequestReset,
  passwordReset,
} = require("../controller/UserController"); // join moudle

router.use(express.json());

router.post("/join", join); // 회원가입
router.post("/login", login); // 로그인
router.post("/reset", passwordRequestReset); // 비밀번호 초기화 요청
router.put("/reset", passwordReset); // 비밀번호 초기화

module.exports = router;
