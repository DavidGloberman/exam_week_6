import Student, { IGrade } from "../models/student";
import Teacher, { ITeacher } from "../models/teacher";
import { ErrorWithStatusCode } from "../models/errorTypes";

export const getGrades = async (id: string): Promise<IGrade[]> => {
  const student = await Student.findOne({ _id: id });
  if (!student) {
    throw new ErrorWithStatusCode("Student not found", 404);
  }
  return student.grades;
};

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

export const addGrade = async (
  teacher: ITeacher,
  studentId: string,
  newGrade: IGrade
): Promise<IGrade> => {
  if (!studentId) {
    throw new ErrorWithStatusCode("studentId is required", 400);
  }

  if (!newGrade.grade || !newGrade.note) {
    throw new ErrorWithStatusCode("grade and note are required", 400);
  }

  // check if student is in teacher's class
  const teacherUser = await Teacher.findOne({ _id: teacher._id });
  if (!teacherUser) {
    throw new ErrorWithStatusCode("Teacher not found", 404);
  }

  const isStudentInTeacherClass = teacherUser.students
    .toString()
    .includes(studentId);
  if (!isStudentInTeacherClass) {
    throw new ErrorWithStatusCode("forbidden, student not in class", 403);
  }

  // check if student exists
  const student = await Student.findOne({ _id: studentId });
  if (!student) {
    throw new ErrorWithStatusCode("Student not found", 404);
  }

  student.grades.push(newGrade);
  student.save();

  newGrade = student.grades[student.grades.length - 1];

  return newGrade;
};

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
