const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");
const AppError = require("../Utils/AppError");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError("Email already in use.", 400));
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    next(new AppError("Server error."));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new AppError("User not found..", 404));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new AppError("Invalid credentials.", 400));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ state: "Authenticated", token });
  } catch (err) {
    next(new AppError("Server error."));
  }
};
