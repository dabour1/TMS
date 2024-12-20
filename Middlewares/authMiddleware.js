const jwt = require("jsonwebtoken");
const AppError = require("../Utils/AppError");
module.exports = (req, res, next) => {
  try {
    let token = req.get("authorization").split(" ")[1];
    let decoded_token = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded_token;
    next();
  } catch (err) {
    let error = new AppError("not Authenticated", 401);
    next(error);
  }
};
