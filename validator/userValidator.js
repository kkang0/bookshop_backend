const { body, param, validationResult } = require("express-validator");

const checkValid = (req, res, next) => {
  const err = validationResult(req);

  if (err.isEmpty()) {
    return next();
  }

  return res.status(400).json(err.array());
};

// User
// 회원가입 유효성 검사
const joinValid = [
  body("email").notEmpty().isEmail().withMessage("email형식"),
  body("password").notEmpty().isString().withMessage("password형식"),
  checkValid,
];
// 로그인 유효성 검사
const loginValid = [
  body("email").notEmpty().isEmail().withMessage("email형식"),
  body("password").notEmpty().isString().withMessage("password형식"),
  checkValid,
];
// 비밀번호 초기화 요청
const pwReqResetValid = [
  body("email").notEmpty().isEmail().withMessage("email형식"),
  checkValid,
];
// 비밀번호 초기화
const pwResetValid = [
  body("email").notEmpty().isEmail().withMessage("email형식"),
  body("password").notEmpty().isString().withMessage("password형식"),
  checkValid,
];

module.exports = {
  joinValid,
  loginValid,
  pwReqResetValid,
  pwResetValid,
  checkValid,
};
