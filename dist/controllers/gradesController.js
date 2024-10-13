"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGrade = exports.getGrades = void 0;
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
const gradesService = __importStar(require("../services/gradesService"));
// of id ,  for both /student and /teacher/:id
exports.getGrades = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id || req.user._id;
    const grades = yield gradesService.getGrades(id);
    res.status(200).json({ success: true, data: grades });
}));
exports.addGrade = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { grade, note } = req.body;
    const newGrade = { grade, note };
    const addedGrade = yield gradesService.addGrade(req.user, req.params.id, newGrade);
    res.status(200).json({ success: true, data: addedGrade });
}));
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
