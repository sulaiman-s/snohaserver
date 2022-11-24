const express = require("express");
const mongobase = require("mongoose");
mongobase.connect("mongodb://localhost/snohabase", () => {
  console.log("connected");
});

const Jobroutes = require("./routes/JobRoute");
const Teamroutes = require("./routes/TeamRoute");
const Courseroutes = require("./routes/CoruseRoute");
const Authroutes = require("./routes/AuthRoute");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.use("/job", Jobroutes);
app.use("/team/member", Teamroutes);
app.use("/course", Courseroutes);
app.use("/user", Authroutes);

app.use("/", (req, res) => {
  res.write("<h1>Working</h1>");
  res.end();
});
const port = process.env.Port | 8000;
app.listen(port, () => console.log("connected" + port));
