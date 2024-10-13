"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const gradeSchema = new mongoose_1.default.Schema({
    grade: {
        type: Number,
        required: [true, "Grade is required"],
        min: [0, "Grade cannot be less than 0"],
        max: [100, "Grade cannot be more than 100"],
    },
    note: {
        type: String,
        required: [true, "note is required"],
        minlength: [3, "note cannot be less than 3 character"],
        maxlength: [500, "note cannot be more than 500 characters"],
        trim: true,
    },
});
const studentSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: [2, "Name cannot be less than 2 character"],
        maxlength: [30, "Name cannot be more than 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    grades: [gradeSchema],
});
exports.default = mongoose_1.default.model("Student", studentSchema);
exports.GradeModel = mongoose_1.default.model("Grade", gradeSchema);
