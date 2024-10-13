import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import { Role } from "../models/role.js";
import * as userService from "../services/userService.js";
import { IGrade } from "../models/user.js";

// of id ,  for both /student and /teacher/:id
export const getGrades = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const wantedUser =
      (req as any).user.role === Role.STUDENT
        ? (req as any).user
        : await userService.getUserByPassportId(req.params.id);
    const grades = wantedUser.grades;
    res.status(200).json({ success: true, data: grades });
  }
);

export const addGrade = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newGrade: IGrade = req.body;
    await userService.addGrade(req.params.id, newGrade);
    res.status(200).json({ success: true });
  }
);

export const updateGrade = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newGrade: IGrade = req.body;
    await userService.updateGrade(req.params.id, newGrade);
    res.status(200).json({ success: true });
  }
);

export const getAverageGrade = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const wantedUser =
      (req as any).user.role === Role.STUDENT
        ? (req as any).user
        : await userService.getUserByPassportId(req.params.id);

    // calculate avg of all grades of wanted user
    const avgGrade = await userService.getAverageGrade(wantedUser);
    res.status(200).json({ success: true, data: avgGrade });
  }
);
