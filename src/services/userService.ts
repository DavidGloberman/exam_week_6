import e from "express";
import { ErrorWithStatusCode } from "../models/errorTypes";
import Student, { IStudent } from "../models/student";
import Teacher, { ITeacher } from "../models/teacher";
import bcrypt from "bcrypt";

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
  email: string,
  password: string
): Promise<IStudent | ITeacher> => {
  if (!email || !password) {
    throw new ErrorWithStatusCode("email and password are required", 401);
  }
  const user =
    (await Student.findOne({ email: email })) ||
    (await Teacher.findOne({ email: email }));
  if (!user) {
    throw new ErrorWithStatusCode("User not found", 401);
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new ErrorWithStatusCode("Wrong password", 401);
  }

  return user;
};

export const getAllStudents = async (teacher: ITeacher) => {
  const students = await Teacher.findOne({ _id: teacher._id }).populate(
    "students"
  );
  if (!students) {
    throw new ErrorWithStatusCode("Teacher not found", 404);
  }
  return students.students;
};

export const getUserByEmail = async (
  email: string
): Promise<IStudent | ITeacher> => {
  const user =
    (await Student.findOne({ email: email })) ||
    (await Teacher.findOne({ email: email }));
  if (!user) {
    throw new ErrorWithStatusCode("User not found", 404);
  }
  return user;
};
