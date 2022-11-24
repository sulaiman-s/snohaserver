const mongobase = require("mongoose");

const teamSchema = mongobase.Schema({
  member_name: { type: String, require: true },
  member_position: { type: String, require: true },
  member_picture: { type: String },
});

const Team = mongobase.model("Team", teamSchema);

module.exports = Team;
