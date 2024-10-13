import express from "express";
import * as gradesController from "../controllers/gradesController";
import { studentMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.use(studentMiddleware);

router.route("/").get(gradesController.getGrades);

export default router;
