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
exports.getUserByEmail = exports.getAllStudents = exports.authenticateUser = exports.createStudent = exports.createTeacher = void 0;
const errorTypes_1 = require("../models/errorTypes");
const student_1 = __importDefault(require("../models/student"));
const teacher_1 = __importDefault(require("../models/teacher"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
const createTeacher = (newTeacher) => __awaiter(void 0, void 0, void 0, function* () {
    if (!newTeacher.fullName ||
        !newTeacher.email ||
        !newTeacher.className ||
        !newTeacher.password) {
        throw new errorTypes_1.ErrorWithStatusCode(" All fields are required", 400);
    }
    const emailExist = (yield student_1.default.findOne({ email: newTeacher.email })) ||
        (yield teacher_1.default.findOne({ email: newTeacher.email }));
    if (emailExist) {
        throw new errorTypes_1.ErrorWithStatusCode("User's email already exists", 409);
    }
    const classNameExists = yield teacher_1.default.findOne({
        className: newTeacher.className,
    });
    if (classNameExists) {
        throw new errorTypes_1.ErrorWithStatusCode("Teacher's class already exists", 409);
    }
    newTeacher.password = yield bcrypt_1.default.hash(newTeacher.password, SALT_ROUNDS);
    try {
        const added = yield teacher_1.default.create(newTeacher);
        return added;
    }
    catch (error) {
        throw new errorTypes_1.ErrorWithStatusCode(error.message, 400);
    }
});
exports.createTeacher = createTeacher;
const createStudent = (newStudent) => __awaiter(void 0, void 0, void 0, function* () {
    if (!newStudent.password ||
        !newStudent.email ||
        !newStudent.fullName ||
        !newStudent.className) {
        throw new errorTypes_1.ErrorWithStatusCode("All fields are required", 400);
    }
    const emailExist = (yield student_1.default.findOne({ email: newStudent.email })) ||
        (yield teacher_1.default.findOne({ email: newStudent.email }));
    if (emailExist) {
        throw new errorTypes_1.ErrorWithStatusCode("User's email already exists", 409);
    }
    const classNameExist = yield teacher_1.default.findOne({
        className: newStudent.className,
    });
    if (!classNameExist) {
        throw new errorTypes_1.ErrorWithStatusCode("ClassName doesn't exist", 409);
    }
    newStudent.password = yield bcrypt_1.default.hash(newStudent.password, SALT_ROUNDS);
    try {
        const added = yield student_1.default.create(newStudent);
        const updated = yield teacher_1.default.updateOne({ className: newStudent.className }, { $push: { students: added._id } }, { new: true });
        return added;
    }
    catch (error) {
        throw new errorTypes_1.ErrorWithStatusCode(error.message, 400);
    }
});
exports.createStudent = createStudent;
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !password) {
        throw new errorTypes_1.ErrorWithStatusCode("email and password are required", 401);
    }
    const user = (yield student_1.default.findOne({ email: email })) ||
        (yield teacher_1.default.findOne({ email: email }));
    if (!user) {
        throw new errorTypes_1.ErrorWithStatusCode("User not found", 401);
    }
    if (!(yield bcrypt_1.default.compare(password, user.password))) {
        throw new errorTypes_1.ErrorWithStatusCode("Wrong password", 401);
    }
    return user;
});
exports.authenticateUser = authenticateUser;
const getAllStudents = (teacher) => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield teacher_1.default.findOne({ _id: teacher._id }).populate("students");
    if (!students) {
        throw new errorTypes_1.ErrorWithStatusCode("Teacher not found", 404);
    }
    return students.students;
});
exports.getAllStudents = getAllStudents;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield student_1.default.findOne({ email: email })) ||
        (yield teacher_1.default.findOne({ email: email }));
    if (!user) {
        throw new errorTypes_1.ErrorWithStatusCode("User not found", 404);
    }
    return user;
});
exports.getUserByEmail = getUserByEmail;
