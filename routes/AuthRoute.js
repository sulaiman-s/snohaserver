const express = require("express");
const bcrypt = require("bcrypt");
const joi = require("joi");
const User = require("../models/User");
const Router = express.Router();
const sendmail = require("../reuse/mailsend");
const jwt = require("jsonwebtoken");

const validateUser = (user) => {
  const schema = joi.object({
    username: joi.string().required().min(8),
    email: joi.string().email().required(),
    password: joi.string().required().min(8),
  });

  const val = schema.validate(user);
  if (val.error) return val.error.message;
};

Router.post("/register", async (req, res) => {
  const { username, email, password, is_admin, is_staff, is_active_user } =
    req.body;
  const validate = validateUser({ username, email, password });
  if (validate) return res.send(validate);
  const checkExistingUser = await User.findOne({ email: email });
  if (checkExistingUser)
    return res
      .status(404)
      .send(
        "User with this email already exist try registering with another email."
      );
  const token = jwt.sign({ username, email, password }, "privateKey");
  const link = `<a href=\"http://localhost:8000/user/verify/${token}\">click to confirm email and registration</a>`;
  sendmail(email, "email confirm", "email confirmation", link);
  res.send("check you email to confirm the registration");
});

Router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const checkUser = await User.findOne({ email: email });
  if (!checkUser)
    return res.status(404).send("user with this email does not exist");

  const verifyPass = await bcrypt.compare(password, checkUser.password);
  if (!verifyPass) return res.send("password does not match");

  const token = checkUser.genAuthToken();
  res.send(token).status(200);
});

Router.get("/verify/:token", async (req, res) => {
  const decode = jwt.verify(req.params.token, "privateKey");
  console.log(decode);
  const user = new User({
    username: decode.username,
    email: decode.email,
  });
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(decode.password, salt);
  user.password = hashPass;
  user.save();
  const token = user.genAuthToken();
  res.header("x-auth-token", token).send("registered successfully");
});

Router.post("/forgotPassword", async (req, res) => {
  const { email } = req.body;
  const checkuser = await User.findOne({ email: email });
  if (!checkuser) return res.send("user with this email not exist").send(404);
  const link = `<a href=\"http://localhost:8000/user/forgot/${checkuser._id}\">click to forgot your password</a>`;
  sendmail(email, "email confirm", "forgot your password", link);
  res.send("forgot password link send.");
});

Router.get("/forgot/:id", async (req, res) => {
  res.render("forgotscreen", { id: req.params.id });
});

Router.post("/forgotconfirm", async (req, res) => {
  const { id, old, newp } = req.body;
  console.log(req.body);
  const finduser = await User.findOne({ _id: id });
  if (!finduser) return res.send("not found");
  const verifyPass = await bcrypt.compare(old, finduser.password);
  if (!verifyPass) return res.send("password does not match");
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(newp, salt);
  await User.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        password: hashPass,
      },
    },
    { new: true }
  );
  res.send("password updated");
});

Router.delete("/:id", async (req, res) => {
  const checkUser = await User.findOne({ _id: req.params.id });
  if (!checkUser) return res.status(404).send("user not found");
  await User.findByIdAndDelete({ _id: req.params.id });
  res.send("deleted success");
});

//verfy-email/:token
//forgetpassword

module.exports = Router;
