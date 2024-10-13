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

export const getAverageGrade = async (teacher: ITeacher): Promise<number> => {
  if (teacher.students.length === 0) {
    return 0;
  }

  // get average grade for all students in the class
  const result = await Student.aggregate([
    {
      $match: { _id: { $in: teacher.students } },
    },
    {
      $project: {
        _id: 0,
        avgGrade: { $avg: "$grades.grade" },
      },
    },
  ]);
  return result[0].avgGrade;
};

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

export const updateGrade = async (
  teacher: ITeacher,
  studentId: string,
  newGrade: IGrade
): Promise<IGrade> => {
  if (!studentId) {
    throw new ErrorWithStatusCode("studentId is required", 400);
  }

  if (!newGrade.grade || !newGrade.note || !newGrade._id) {
    throw new ErrorWithStatusCode(" grade and note and _id are required", 400);
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

  const updatedGrade = await Student.findOneAndUpdate(
    { _id: studentId, "grades._id": newGrade._id },
    { $set: { "grades.$": newGrade } },
    { new: true }
  );

  return updatedGrade as unknown as IGrade;
};
