const { body } = require("express-validator");

exports.createTaskValidation = [
  body("title").trim().notEmpty().withMessage("Title is required."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be one of: Pending, In Progress, Completed."),
  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Due Date must be a valid date."),
];

exports.updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty."),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  body("status")
    .optional()
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Status must be one of: Pending, In Progress, Completed."),
  body("dueDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Due Date must be a valid date."),
];
