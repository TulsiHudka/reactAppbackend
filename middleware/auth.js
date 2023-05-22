const jwt = require("jsonwebtoken");
const config = require("../Config/config");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  // console.log("token", token);
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.secret_jwt);
    // console.log(decodedToken);
    // console.log(config.secret_jwt);
  } catch (err) {
    err.statusCode = 428;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};