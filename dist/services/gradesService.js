"use strict";
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
const student_1 = __importDefault(require("../models/student"));
const teacher_1 = __importDefault(require("../models/teacher"));
const errorTypes_1 = require("../models/errorTypes");
const getGrades = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_1.default.findOne({ _id: id });
    if (!student) {
        throw new errorTypes_1.ErrorWithStatusCode("Student not found", 404);
    }
    return student.grades;
});
exports.getGrades = getGrades;
// export const getAverageGrade = async (wantedUser: IUser): Promise<number> => {
//   if (wantedUser.grades.length === 0) {
//     return 0;
//   }
//   //----------------------------------
//   const result = await UserModel.aggregate([
//     {
//       $match: { _id: wantedUser._id },
//     },
//     {
//       $project: {
//         _id: 0,
//         avgGrade: { $avg: "$grades.grade" },
//       },
//     },
//   ]);
//   console.log("result:", result);
//   //-----------------------------------------
//   return (
//     wantedUser.grades.reduce((a: number, b: IGrade) => a + b.grade, 0) /
//     wantedUser.grades.length
//   );
// };
const addGrade = (teacher, studentId, newGrade) => __awaiter(void 0, void 0, void 0, function* () {
    if (!studentId) {
        throw new errorTypes_1.ErrorWithStatusCode("studentId is required", 400);
    }
    if (!newGrade.grade || !newGrade.note) {
        throw new errorTypes_1.ErrorWithStatusCode("grade and note are required", 400);
    }
    // check if student is in teacher's class
    const teacherUser = yield teacher_1.default.findOne({ _id: teacher._id });
    if (!teacherUser) {
        throw new errorTypes_1.ErrorWithStatusCode("Teacher not found", 404);
    }
    const isStudentInTeacherClass = teacherUser.students
        .toString()
        .includes(studentId);
    if (!isStudentInTeacherClass) {
        throw new errorTypes_1.ErrorWithStatusCode("forbidden, student not in class", 403);
    }
    // check if student exists
    const student = yield student_1.default.findOne({ _id: studentId });
    if (!student) {
        throw new errorTypes_1.ErrorWithStatusCode("Student not found", 404);
    }
    student.grades.push(newGrade);
    student.save();
    newGrade = student.grades[student.grades.length - 1];
    return newGrade;
});
exports.addGrade = addGrade;
// export const updateGrade = async (
//   teacher: ITeacher,
//   studentId: string,
//   newGrade: IGrade
// ): Promise<IGrade> => {
//   if (!studentId) {
//     throw new ErrorWithStatusCode("studentId is required", 400);
//   }
//   if (!newGrade.grade || !newGrade.note) {
//     throw new ErrorWithStatusCode("grade and note are required", 400);
//   }
//   // check if student is in teacher's class
//   const teacherUser = await Teacher.findOne({ _id: teacher._id });
//   if (!teacherUser) {
//     throw new ErrorWithStatusCode("Teacher not found", 404);
//   }
//   const isStudentInTeacherClass = teacherUser.students
//     .toString()
//     .includes(studentId);
//   if (!isStudentInTeacherClass) {
//     throw new ErrorWithStatusCode("forbidden, student not in class", 403);
//   }
//   // check if student exists
//   const student = await Student.findOne({ _id: studentId });
//   if (!student) {
//     throw new ErrorWithStatusCode("Student not found", 404);
//   }
//   // יש לסיים לוגיקה שתעשה את השינוי
//   return newGrade;
// };
