const jwt = require("jsonwebtoken");
const mongobase = require("mongoose");

const userSchema = mongobase.Schema({
  username: { type: String, require: true, maxLength: 50 },
  email: { type: String, require: true, maxLength: 50 },
  password: { type: String, require: true },
  is_admin: { type: Boolean, default: false },
  is_staff: { type: Boolean, default: false },
  is_active_user: { type: Boolean, default: true },
  join_date: { type: Date, default: new Date().toDateString() },
});

userSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
      username: this.username,
      email: this.email,
      admin: this.is_admin,
      staff: this.is_staff,
      user: this.is_active_user,
    },
    "privateKey"
  );
  return token;
};

const User = mongobase.model("User", userSchema);

module.exports = User;
