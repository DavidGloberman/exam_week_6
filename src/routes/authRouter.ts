import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.route("/studentsRegister").post(authController.studentRegister);

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
 *                      passportId:
 *                        type: string
 *                      password:
 *                        type: string
 *                    example:
 *                      passportId: 123456789
 *                      password: password
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
router.route("/teacherRegister").post(authController.teacherRegister);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: registers a new user
 *     requestBody:
 *            required: true
 *            content:
 *              application/json:
 *                  schema:
 *                    type: object
 *                    properties:
 *                      fullName:
 *                        type: string
 *                      passportId:
 *                        type: string
 *                      password:
 *                        type: string
 *                    example:
 *                      fullName: John Doe
 *                      passportId: 123456789
 *                      password: password
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
 *                    example: "User created successfully"
 *
 *
 */

router.route("/login").post(authController.login);

export default router;
