import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import * as userService from "../services/userService.js";

export const getAllStudents = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  }
);
