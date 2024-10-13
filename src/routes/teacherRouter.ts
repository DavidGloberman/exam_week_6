import { Router } from "express";
import * as gradesController from "../controllers/gradesController";
import { getAllStudents } from "../controllers/userController";
import { teacherMiddleware } from "../middleware/authMiddleware";
const router = Router();

router.use(teacherMiddleware);

router
  .route("/grade/:id")
  .get(gradesController.getGrades)
  .post(gradesController.addGrade)
  // .put(gradesController.updateGrade);

// router.route("/avgGrade").get(gradesController.getAverageGrade);

router.route("/allStudents").get(getAllStudents);

export default router;
