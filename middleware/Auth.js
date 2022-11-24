const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  if (!req.header("x-auth-token"))
    return res.send("authentication token required");
  try {
    const decodetoken = jwt.verify(req.header("x-auth-token"), "privateKey");
    req.user = decodetoken;
    next();
  } catch (error) {
    res.send("invalid token");
  }
};
