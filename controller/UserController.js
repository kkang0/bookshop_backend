// 240410 C팀 강정윤
const conn = require("../mariadb"); // db module
const { StatusCodes } = require("http-status-codes"); // status code module
const jwt = require("jsonwebtoken"); // jwt module
const dotenv = require("dotenv"); // dotenv module
dotenv.config();
const crypto = require("crypto"); // crypto(암호화) 기본 내장 모듈

// 회원가입 유효성 검사

// 회원가입 컨트롤러
const join = (req, res) => {
  try {
    const { email, password } = req.body;

    let sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";

    // 암호화된 비밀번호와 솔트값을 db에 저장
    const salt = crypto.randomBytes(10).toString("base64");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 10, "sha512")
      .toString("base64");

    let values = [email, hashedPassword, salt];
    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      // 성공적으로 INSERT
      if ((results.affectedRows = 1)) {
        return res.status(StatusCodes.CREATED).json(results);
      }

      // 실패하면
      return res.status(StatusCodes.BAD_REQUEST).end();
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

// 로그인 컨트롤러
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";

    conn.query(sql, email, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      const loginUser = results[0];

      // 입력된 비밀번호 암호화
      const hasehdPassword = crypto
        .pbkdf2Sync(password, loginUser.salt, 10000, 10, "sha512")
        .toString("base64");

      // 암호화된 비밀번호와 db의 비밀번호와 비교하기
      if (loginUser && loginUser.password == hasehdPassword) {
        // token 발행
        const token = jwt.sign(
          {
            id: loginUser.id,
            email: loginUser.email,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "30m",
            issuer: "kkang",
          }
        );

        // 쿠키에 토큰 담기
        res.cookie("token", token, {
          httpOnly: true,
        });

        return res.status(StatusCodes.OK).json(results);
      }

      // error
      return res.status(StatusCodes.UNAUTHORIZED).end(); // 401
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

// 비밀번호 초기화 요청 컨트롤러
const passwordRequestReset = (req, res) => {
  try {
    const { email } = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";

    conn.query(sql, email, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      // email로 user가 존재하는지 확인
      const findUser = results[0];
      // user가 존재하면 email을 응답으로 보내줌
      if (findUser) {
        return res.status(StatusCodes.OK).json({
          email: email,
        });
      }

      // user가 존재하지 않는다면 (401)
      return res.status(StatusCodes.UNAUTHORIZED).end();
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

// 비밀번호 초기화
const passwordReset = (req, res) => {
  try {
    const { email, password } = req.body;

    let sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";

    // 암호화된 비밀번호와 솔트값을 db에 저장
    const salt = crypto.randomBytes(10).toString("base64");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 10, "sha512")
      .toString("base64");

    let values = [hashedPassword, salt, email];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.log(results);
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      // 업데이트가 잘 안됐다면
      if (results.affectedRows == 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
      }

      // 비밀번호 초기화(수정)가 성공했다면
      return res.status(StatusCodes.OK).json(results);
    });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.BAD_REQUEST).end();
  }
};

// 모듈화
module.exports = {
  join,
  login,
  passwordRequestReset,
  passwordReset,
};
