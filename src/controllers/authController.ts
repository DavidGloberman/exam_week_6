import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { IStudent } from "../models/student.js";
import { ITeacher } from "../models/teacher.js";
import jwt from "jsonwebtoken";
import * as studentService from "../services/userService.js";
import * as teacherService from "../services/teacherService.js";

import { ErrorWithStatusCode } from "../models/errorTypes.js";

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { passportId, password } = req.body;
    const user = await studentService.authenticateUser(passportId, password);

    if (!user) {
      throw new ErrorWithStatusCode("User not found", 404);
    }
    const token = jwt.sign(
      { passportId: user.passportId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "User logged in successfully" });
  }
);

export const studentRegister = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newStudent: IStudent = req.body;
    const added = await studentService.createStudent(newStudent);
    res.status(201).json({ message: "User created successfully" });
  }
);

export const teacherRegister = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newTeacher: ITeacher = req.body;
    const added = await teacherService.createTeacher(newTeacher);
    res.status(201).json({ message: "User created successfully", data: added });
  }
);
