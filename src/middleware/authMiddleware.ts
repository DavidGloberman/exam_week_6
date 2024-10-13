import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import * as userService from "../services/userService";
import Student, { IStudent } from "../models/student";
import Teacher, { ITeacher } from "../models/teacher";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token; // Extract token from cookies
  if (!token) {
    res.status(401).send({ message: "Unauthorized, missing token" });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const email = (decoded as { email: string }).email;

  if (!email) {
    res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const user: IStudent | ITeacher = await userService.getUserByEmail(email);
    (req as any).user = user;
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "Unauthorized" });
  }

  next();
};

export const teacherMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!emailIsInTeachers((req as any).user.email)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export const studentMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!emailIsInStudents((req as any).user.email)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

const emailIsInTeachers = (email: string): boolean => {
  const teachers = Teacher.findOne({ email: email });
  return teachers as unknown as boolean;
};

const emailIsInStudents = (email: string): boolean => {
  const students = Student.findOne({ email: email });
  return students as unknown as boolean;
};
