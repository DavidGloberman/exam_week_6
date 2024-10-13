import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler";
import * as gradesService from "../services/gradesService";
import { IGrade } from "../models/student";

// of id ,  for both /student and /teacher/:id
export const getGrades = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const id = req.params.id || (req as any).user._id;
    const grades = await gradesService.getGrades(id);
    res.status(200).json({ success: true, data: grades });
  }
);

export const addGrade = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { grade, note } = req.body;
    const newGrade: IGrade = { grade, note };
    const addedGrade = await gradesService.addGrade((req as any).user, req.params.id, newGrade);
    res.status(200).json({ success: true , data: addedGrade});
  }
);

// export const updateGrade = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const { grade, note } = req.body;
//     const newGrade: IGrade = { grade, note };
//     const updatedGrade = await gradesService.updateGrade((req as any).user, req.params.id, newGrade);
//     res.status(200).json({ success: true , data: updatedGrade});
//   }
// );

// export const getAverageGrade = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const wantedUser =
//       (req as any).user.role === Role.STUDENT
//         ? (req as any).user
//         : await userService.getUserByPassportId(req.params.id);

//     // calculate avg of all grades of wanted user
//     const avgGrade = await userService.getAverageGrade(wantedUser);
//     res.status(200).json({ success: true, data: avgGrade });
//   }
// );
