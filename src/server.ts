import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger";

import { connectDB } from "./config/db";
import authRouter from "./routes/authRouter";
import studentRouter from "./routes/studentRouter";
import teacherRouter from "./routes/teacherRouter";
import { authMiddleware } from "./middleware/authMiddleware";
import { errorMiddleware } from "./middleware/errorHandler";

dotenv.config();
connectDB();
const app: Application = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", authRouter);

app.use(authMiddleware);

app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
