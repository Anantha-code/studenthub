const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
      unique: true,
      maxlength: [30, "Roll number cannot exceed 30 characters"],
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: 80,
    },
    year: {
      type: Number,
      required: [true, "Study year is required"],
      min: 1,
      max: 8,
    },
    marks: {
      type: Number,
      required: [true, "Marks are required"],
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
