const express = require("express");
const { register, login } = require("../Controllers/authController");
const router = express.Router();
const {
  validateRegister,
  validateLogin,
} = require("../Middlewares/validations/authValidation");
const validationResult = require("../Middlewares/validations/validatorResult");

router.post("/register", validateRegister, validationResult, register);
router.post("/login", validateLogin, validationResult, login);

module.exports = router;
