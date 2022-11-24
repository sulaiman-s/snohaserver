const mongobase = require("mongoose");

const jobSchema = mongobase.Schema({
  job_title: { type: String, require: true },
  job_description: { type: String, require: true },
  job_type: { type: String, require: true },
  related_image: { type: String },
});

const Job = mongobase.model("Job", jobSchema);

module.exports = Job;
