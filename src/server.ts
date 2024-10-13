import express, { Application } from "express";

import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/errorHandler.js";
import authRouter from "./routes/authRouter.js";
import studentRouter from "./routes/studentRouter.js";
import teacherRouter from "./routes/teacherRouter.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import specs from "./swagger.js";

dotenv.config();
connectDB();
const app: Application = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000;

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
