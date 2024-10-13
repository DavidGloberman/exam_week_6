import mongoose, { Types } from "mongoose";
import validator from "validator";

export interface ITeacher extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  className: string;
  students: Types.ObjectId[];
}

const teacherSchema: mongoose.Schema<ITeacher> = new mongoose.Schema({
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
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
  },
  className: {
    type: String,
    required: [true, "Class name is required"],
    unique: true,
    trim: true,
    minlength: [3, "Class name cannot be less than 3 character"],
    maxlength: [30, "Class name cannot be more than 30 characters"],
  },
  students: [{ type: Types.ObjectId, ref: "Student" }],
});

export default mongoose.model<ITeacher>("Teacher", teacherSchema);
