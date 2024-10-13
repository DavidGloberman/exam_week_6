import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { IStudent } from "../models/student";
import { ITeacher } from "../models/teacher";
import * as userService from "../services/userService";

import { ErrorWithStatusCode } from "../models/errorTypes";

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);

    if (!user) {
      throw new ErrorWithStatusCode("User not found", 404);
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.MODE_ENV === "production",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "User logged in successfully" });
  }
);

export const studentRegister = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newStudent: IStudent = req.body;
    const added = await userService.createStudent(newStudent);
    res.status(201).json({ message: "Student created successfully" });
  }
);

export const teacherRegister = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newTeacher: ITeacher = req.body;
    const added = await userService.createTeacher(newTeacher);
    res.status(201).json({ message: "Teacher created successfully", className: added.className });
  }
);
