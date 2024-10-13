import bcrypt from "bcrypt";

import { ErrorWithStatusCode } from "../models/errorTypes.js";
import Teacher, { ITeacher } from "../models/teacher.js";
import Student, { IStudent } from "../models/student.js";

const SALT_ROUNDS = 10;

export const createTeacher = async (
  newTeacher: ITeacher
): Promise<ITeacher> => {
  if (
    !newTeacher.fullName ||
    !newTeacher.email ||
    !newTeacher.className ||
    !newTeacher.password
  ) {
    throw new ErrorWithStatusCode(" All fields are required", 400);
  }

  const emailExist =
    (await Student.findOne({ email: newTeacher.email })) ||
    (await Teacher.findOne({ email: newTeacher.email }));
  if (emailExist) {
    throw new ErrorWithStatusCode("User's email already exists", 409);
  }

  const classNameExists = await Teacher.findOne({
    className: newTeacher.className,
  });
  if (classNameExists) {
    throw new ErrorWithStatusCode("Teacher's class already exists", 409);
  }

  newTeacher.password = await bcrypt.hash(newTeacher.password, SALT_ROUNDS);
  try {
    const added = await Teacher.create(newTeacher);
    return added;
  } catch (error: any) {
    throw new ErrorWithStatusCode(error.message, 400);
  }
};
