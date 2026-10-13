const express = require("express");
const mongoose = require("mongoose");
const Student = require("../models/Student");

const router = express.Router();
const validId = (id) => mongoose.isValidObjectId(id);

// GET /api/students?q=search-term
router.get("/", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    const filter = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { rollNumber: { $regex: q, $options: "i" } },
            { department: { $regex: q, $options: "i" } },
          ],
        }
      : {};
    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
});

// GET /api/students/:id
router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// POST /api/students
router.post("/", async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That roll number already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// PUT /api/students/:id
router.put("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That roll number already exists" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// DELETE /api/students/:id
router.delete("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully", id: student._id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
