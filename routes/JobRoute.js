const express = require("express");
const Jobs = require("../models/Job");
const Auth = require("../middleware/Auth");
const upload = require("../middleware/multerUpload");
const Router = express.Router();
// Router.use(Auth);

Router.get("/", async (req, res) => {
  const allJobs = await Jobs.find();
  if (allJobs.length < 1) return res.status(404).send("no job postings");
  console.log(req.user);
  res.send(allJobs);
});

Router.post("/", upload.single("related_image"), async (req, res) => {
  const { job_title, job_description, job_type } = req.body;
  console.log(req.body);
  const job = await Jobs.create({
    job_title,
    job_description,
    job_type,
    related_image: req.file.filename,
  });
  res.send(job);
});

Router.put("/:id", upload.single("related_image"), async (req, res) => {
  const { job_title, job_description, job_type, related_image } = req.body;
  const updated = await Jobs.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        job_title,
        job_description,
        job_type,
        related_image: req.file.filename,
      },
    },
    { new: true }
  );
  res.send(updated);
});

Router.delete("/:id", async (req, res) => {
  const to_delete = await Jobs.findByIdAndDelete({ _id: req.params.id });
  res.send(to_delete);
});

module.exports = Router;
