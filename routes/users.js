const express = require("express"); // express module
const userRouter = express.Router();
const {
  join,
  login,
  passwordRequestReset,
  passwordReset,
} = require("../controller/UserController"); // join moudle

const {
  joinValid,
  loginValid,
  pwReqResetValid,
  pwResetValid,
} = require("../validator/userValidator"); // 유효성 검사

userRouter.use(express.json());

userRouter.post("/join", joinValid, join); // 회원가입
userRouter.post("/login", loginValid, login); // 로그인
userRouter.post("/reset", pwReqResetValid, passwordRequestReset); // 비밀번호 초기화 요청
userRouter.put("/reset", pwResetValid, passwordReset); // 비밀번호 초기화

module.exports = userRouter;
