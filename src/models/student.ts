import mongoose, { Types } from "mongoose";
import validator from "validator";

export interface IGrade {
  _id?: Types.ObjectId
  grade: number;
  note: string;
}

export interface IStudent extends mongoose.Document {
  fullName: string;
  email: string;
  password: string;
  grades: IGrade[];
  className: string;
}

const gradeSchema: mongoose.Schema<IGrade> = new mongoose.Schema({
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

const studentSchema: mongoose.Schema<IStudent> = new mongoose.Schema({
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
  grades: [gradeSchema],
});

export default mongoose.model<IStudent>("Student", studentSchema);

export const GradeModel = mongoose.model<IGrade>("Grade", gradeSchema);
