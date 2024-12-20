const Task = require("../Models/TaskSchema");
const AppError = require("../Utils/AppError");
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = new Task({
      title,
      description,
      status,
      dueDate,
      userId: req.user.id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    next(new AppError("Server error."));
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    res.status(200).json(tasks);
  } catch (err) {
    next(new AppError("Server error."));
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return next(new AppError("Task not found.", 404));
    res.status(200).json(task);
  } catch (err) {
    next(new AppError("Server error."));
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) return next(new AppError("Task not found.", 404));

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (err) {
    next(new AppError("Server error."));
  }
};
