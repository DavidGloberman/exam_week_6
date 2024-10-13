import express from "express";
import * as authController from "../controllers/authController";

const router = express.Router();

/**
 * @swagger
 * /student/register:
 *   post:
 *     summary: registers a new student
 *     requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      fullName:
 *                        type: string
 *                      email:
 *                        type: string
 *                      password:
 *                        type: string
 *                      className:
 *                        type:string
 *                    example:
 *                      fullName: John Doe
 *                      email: example@gmail.com
 *                      password: 1234
 *                      className: moshe
 *
 *     responses:
 *       201:
 *         description: register
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Student created successfully"
 *
 *
 */

router.route("/studentsRegister").post(authController.studentRegister);

/**
 * @swagger
 * /teacher/register:
 *   post:
 *     summary: registers a new teacher
 *     requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      fullName:
 *                        type: string
 *                      email:
 *                        type: string
 *                      password:
 *                        type: string
 *                      className:
 *                        type:string
 *                    example:
 *                      fullName: John Doe
 *                      email: example@gmail.com
 *                      password: 1234
 *                      className: moshe
 *
 *     responses:
 *       201:
 *         description: register
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "Teacher created successfully"
 *
 *
 */
router.route("/teacherRegister").post(authController.teacherRegister);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: login in
 *     requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      email:
 *                        type: string
 *                      password:
 *                        type: string
 *                    example:
 *                      email: example@gmail.com
 *                      password: 1234
 *
 *     responses:
 *       201:
 *         description: login
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: "User logged in successfully"
 *
 *
 */
router.route("/login").post(authController.login);

export default router;
