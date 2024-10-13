import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import * as userService from "../services/userService.js";
import { IUser } from "../models/user.js";
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token; // Extract token from cookies
  if (!token) {
    res.status(401).send({ message: "Unauthorized, missing token" });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const passportId = (decoded as { passportId: string }).passportId;

  if (!passportId) {
    res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const user: IUser = await userService.getUserByPassportId(passportId);
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
  if ((req as any).user.role !== Role.TEACHER) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

export const studentMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req as any).user.role !== Role.STUDENT) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
