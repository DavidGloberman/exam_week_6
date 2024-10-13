import { ErrorWithStatusCode } from "../models/errorTypes.js";
import Student, { IGrade, IStudent } from "../models/student.js";
import Teacher, { ITeacher } from "../models/teacher.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const createStudent = async (
  newStudent: IStudent
): Promise<IStudent> => {
  if (
    !newStudent.password ||
    !newStudent.email ||
    !newStudent.fullName ||
    !newStudent.className
  ) {
    throw new ErrorWithStatusCode("All fields are required", 400);
  }

  const emailExist =
    (await Student.findOne({ email: newStudent.email })) ||
    (await Teacher.findOne({ email: newStudent.email }));
  if (emailExist) {
    throw new ErrorWithStatusCode("User's email already exists", 409);
  }

  const classNameExist = await Teacher.findOne({
    className: newStudent.className,
  });
  if (!classNameExist) {
    throw new ErrorWithStatusCode("ClassName doesn't exist", 409);
  }

  newStudent.password = await bcrypt.hash(newStudent.password, SALT_ROUNDS);

  try {
    const added = await Student.create(newStudent);
    const updated = await Teacher.updateOne(
      { className: newStudent.className },
      { $push: { students: added._id } },
      { new: true }
    );
    return added;
  } catch (error: any) {
    throw new ErrorWithStatusCode(error.message, 400);
  }
};

export const authenticateUser = async (
  passportId: string,
  password: string
): Promise<IUser> => {
  if (!passportId || !password) {
    throw new ErrorWithStatusCode("passportId and password are required", 401);
  }
  const user = await UserModel.findOne({ passportId });
  if (!user) {
    throw new ErrorWithStatusCode("User not found", 401);
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new ErrorWithStatusCode("invalid id or password", 401);
  }

  return user;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return await UserModel.find();
};

export const getAverageGrade = async (wantedUser: IUser): Promise<number> => {
  if (wantedUser.grades.length === 0) {
    return 0;
  }

  //----------------------------------
  const result = await UserModel.aggregate([
    {
      $match: { _id: wantedUser._id },
    },
    {
      $project: {
        _id: 0,
        avgGrade: { $avg: "$grades.grade" },
      },
    },
  ]);
  console.log("result:", result);
  //-----------------------------------------
  return (
    wantedUser.grades.reduce((a: number, b: IGrade) => a + b.grade, 0) /
    wantedUser.grades.length
  );
};

export const addGrade = async (
  passportId: string,
  newGrade: IGrade
): Promise<void> => {
  console.log("passportId:", passportId);

  if (!passportId) {
    throw new ErrorWithStatusCode("passportId is required", 400);
  }
  if (!newGrade) {
    throw new ErrorWithStatusCode("grade is required", 400);
  }

  const wantedUser: IUser | null = await UserModel.findOne({
    passportId: passportId,
  });
  if (!wantedUser) {
    throw new Error("User not found");
  }

  wantedUser.grades.push(newGrade);
  wantedUser.save();
};

export const updateGrade = async (
  passportId: string,
  newGrade: IGrade
): Promise<void> => {
  if (!passportId) {
    throw new ErrorWithStatusCode("passportId is required", 400);
  }
  const user = await getUserByPassportId(passportId);
  user.grades = user.grades.filter((g) => g.subject !== newGrade.subject);
  user.grades.push(newGrade);
  user.save();
};
