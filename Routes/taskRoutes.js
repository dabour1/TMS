const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../Controllers/taskController");
const authMiddleware = require("../Middlewares/authMiddleware");
const validationResult = require("../Middlewares/validations/validatorResult");
const {
  createTaskValidation,
  updateTaskValidation,
} = require("../Middlewares/validations/taskValidations");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createTaskValidation,
  validationResult,
  createTask
);
router.get("/", authMiddleware, getTasks);
router.put(
  "/:id",
  authMiddleware,
  updateTaskValidation,
  validationResult,
  updateTask
);
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
