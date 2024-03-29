import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./routes/user.router.js";
import LogMiddleware from "./middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./middlewares/error-handling-middleware.js";
import ResumeRouter from "./routes/resume.router.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3018;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, ResumeRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
