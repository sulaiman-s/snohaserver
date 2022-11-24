const express = require("express");
const upload = require("../middleware/multerUpload");
const Teams = require("../models/Teams");
const Router = express.Router();

Router.get("/", async (req, res) => {
  const allmembers = await Teams.find();
  if (allmembers.length < 1) return res.status(404).send("no job postings");
  res.send(allmembers);
});

Router.post("/", upload.single("member_picture"), async (req, res) => {
  const { member_name, member_position } = req.body;
  console.log(req.body);
  const member = await Teams.create({
    member_name,
    member_position,
    member_picture: req.file.filename,
  });
  res.send(member);
});

Router.put("/:id", upload.single("member_picture"), async (req, res) => {
  const { member_name, position_name } = req.body;
  const updated = await Teams.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        member_name,
        position_name,
        member_picture: req.file.filename,
      },
    },
    { new: true }
  );
  res.send(updated);
});

Router.delete("/:id", async (req, res) => {
  const to_delete = await Teams.findByIdAndDelete({ _id: req.params.id });
  res.send(to_delete);
});

module.exports = Router;
