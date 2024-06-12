// 240409 C팀 강정윤
// express module
const express = require("express");
const app = express();

// dotenv module
const dotevn = require("dotenv");
dotevn.config();

// CORS module
const cors = require("cors");

// CORS 설정
const corsOptions = {
  origin: "http://localhost:3000", // 클라이언트의 출처를 명시
  credentials: true, // 인증 정보를 포함한 요청을 허용
};
app.use(cors(corsOptions));

app.listen(process.env.PORT);

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const categoryRouter = require("./routes/category");
const likeRouter = require("./routes/likes");
const cartRouter = require("./routes/carts");
const orderRouter = require("./routes/orders");

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/likes", likeRouter);
app.use("/carts", cartRouter);
app.use("/orders", orderRouter);
