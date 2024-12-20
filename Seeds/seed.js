const mongoose = require("mongoose");
const User = require("../Models/UserSchema");
const Task = require("../Models/TaskSchema");

const mongoURI = "mongodb://127.0.0.1:27017/task_management";

const users = [
  { name: "Alice", email: "alice@example.com", password: "password@123" },
  { name: "Bob", email: "bob@example.com", password: "password@123" },
];

const tasks = [
  {
    title: "Task 1",
    description: "First task description",
    status: "Pending",
    dueDate: new Date(),
    userId: null, // To be set after users are inserted
  },
  {
    title: "Task 2",
    description: "Second task description",
    status: "In Progress",
    dueDate: new Date(),
    userId: null, // To be set after users are inserted
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("Cleared existing data");

    // Insert users
    const insertedUsers = await User.insertMany(users);
    console.log("Users inserted:", insertedUsers);

    // Assign userId to tasks
    tasks[0].userId = insertedUsers[0]._id;
    tasks[1].userId = insertedUsers[1]._id;

    // Insert tasks
    const insertedTasks = await Task.insertMany(tasks);
    console.log("Tasks inserted:", insertedTasks);

    console.log("Database seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
