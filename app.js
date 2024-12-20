const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./Routes/routes");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api", routes);

const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/task_management";
connectDB(mongoURI);

app.use((request, response) => {
  response.status(404).json({ data: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  } else {
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`I am listening.......... ${PORT}`);
});
module.exports = app;
