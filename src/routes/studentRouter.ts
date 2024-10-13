import express from "express";
import * as gradesController from "../controllers/gradesController.js";
import { studentMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(studentMiddleware);

router.route("/").get(gradesController.getGrades);

export default router;
