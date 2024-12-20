const { validationResult } = require("express-validator");
const AppError = require("../../Utils/AppError");
module.exports = (req, res, next) => {
  let result = validationResult(req);
  if (result.errors.length > 0) {
    let errorMsg = result.errors.reduce(
      (current, item) => current + item.msg + " ",
      ""
    );
    let error = new AppError(errorMsg, 422);

    next(error);
  } else next();
};