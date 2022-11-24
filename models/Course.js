const mongobase = require("mongoose");

const courseSchema = mongobase.Schema({
  course_name: { type: String, require: true },
  course_des: { type: String, require: true },
  course_picture: { type: String, require: true },
});

const Course = mongobase.model("Course", courseSchema);

module.exports = Course;
