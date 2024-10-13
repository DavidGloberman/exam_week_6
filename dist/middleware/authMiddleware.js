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
exports.studentMiddleware = exports.teacherMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userService = __importStar(require("../services/userService"));
const student_1 = __importDefault(require("../models/student"));
const teacher_1 = __importDefault(require("../models/teacher"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token; // Extract token from cookies
    if (!token) {
        res.status(401).send({ message: "Unauthorized, missing token" });
        return;
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;
    if (!email) {
        res.status(401).send({ message: "Unauthorized" });
    }
    try {
        const user = yield userService.getUserByEmail(email);
        req.user = user;
    }
    catch (err) {
        console.log(err);
        res.status(401).send({ message: "Unauthorized" });
    }
    next();
});
exports.authMiddleware = authMiddleware;
const teacherMiddleware = (req, res, next) => {
    if (!emailIsInTeachers(req.user.email)) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
exports.teacherMiddleware = teacherMiddleware;
const studentMiddleware = (req, res, next) => {
    if (!emailIsInStudents(req.user.email)) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
exports.studentMiddleware = studentMiddleware;
const emailIsInTeachers = (email) => {
    const teachers = teacher_1.default.findOne({ email: email });
    return teachers;
};
const emailIsInStudents = (email) => {
    const students = student_1.default.findOne({ email: email });
    return students;
};
