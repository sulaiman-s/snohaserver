const express = require("express");
const upload = require("../middleware/multerUpload");
const Course = require("../models/Course");
const Router = express.Router();

Router.get("/", async (req, res) => {
  const allCourses = await Course.find();
  if (allCourses.length < 1) return res.status(404).send("no job postings");
  res.send(allCourses);
});

Router.post("/", upload.single("course_picture"), async (req, res) => {
  const { course_name, course_des } = req.body;
  console.log(req.body);
  const course = await Course.create({
    course_name,
    course_des,
    course_picture: req.file.filename,
  });
  res.send(course);
});

Router.put("/:id", upload.single("course_picture"), async (req, res) => {
  const { course_name, course_des } = req.body;
  const updated = await Course.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        course_name,
        course_des,
        course_picture: req.file.filename,
      },
    },
    { new: true }
  );
  res.send(updated);
});

Router.delete("/:id", async (req, res) => {
  const to_delete = await Course.findByIdAndDelete({ _id: req.params.id });
  res.send(to_delete);
});

module.exports = Router;
