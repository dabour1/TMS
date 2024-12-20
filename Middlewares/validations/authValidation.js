const { body } = require("express-validator");

exports.validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required.")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long."),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .withMessage(
      "Password must contain a letter, number, and special character."
    ),
];
exports.validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];
