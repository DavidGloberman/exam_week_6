import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler";
import * as userService from "../services/userService";

export const getAllStudents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const students = await userService.getAllStudents((req as any).user);
    res.status(200).json({ success: true, data: students });
  }
);
