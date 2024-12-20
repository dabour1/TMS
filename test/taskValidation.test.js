const chai = require("chai");

const { expect } = chai;
const { connectDB, closeDB, clearDB } = require("./setup");
const Task = require("../Models/TaskSchema");

const app = require("../app");
const User = require("../Models/UserSchema");
describe("Task Validation", function () {
  before(async () => {
    await connectDB();
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password@123",
    });
    userId = user._id;

    const res = await chai.request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password@123",
    });
    token = res.body.token;
  });

  after(async () => {
    await closeDB();
  });
  afterEach(async () => {
    await clearDB();
  });

  describe("POST /api/tasks", function () {
    it("should return validation errors when title is missing", async function () {
      const response = await chai
        .request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          description: "Task without title",
          status: "Pending",
          dueDate: "2024-12-31T23:59:59.000Z",
        });

      expect(response.status).to.equal(422);
      expect(response.body)
        .to.have.property("message")
        .that.includes("Title is required.");
    });

    it("should return validation errors when status is invalid", async function () {
      const response = await chai
        .request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Valid Task",
          description: "Valid description",
          status: "Invalid Status",
          dueDate: "2024-12-31T23:59:59.000Z",
        });

      expect(response.status).to.equal(422);
      expect(response.body)
        .to.have.property("message")
        .that.includes(
          "Status must be one of: Pending, In Progress, Completed."
        );
    });

    it("should return validation errors when dueDate is invalid", async function () {
      const response = await chai
        .request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Valid Task",
          description: "Valid description",
          status: "Pending",
          dueDate: "invalid-date",
        });

      expect(response.status).to.equal(422);
      expect(response.body)
        .to.have.property("message")
        .that.includes("Due Date must be a valid date.");
    });

    it("should pass validation when all fields are correct", async function () {
      const response = await chai
        .request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Valid Task",
          description: "Valid description",
          status: "In Progress",
          dueDate: "2024-12-31T23:59:59.000Z",
        });

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property("title").that.equals("Valid Task");
      expect(response.body)
        .to.have.property("status")
        .that.equals("In Progress");
    });
  });

  describe("PUT /api/tasks/:id", function () {
    it("should return validation errors when title is empty", async function () {
      const response = await chai
        .request(app)
        .put(`/api/tasks/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "",
          description: "Updated description",
          status: "Completed",
          dueDate: "2024-12-31T23:59:59.000Z",
        });

      expect(response.status).to.equal(422);
      expect(response.body)
        .to.have.property("message")
        .that.includes("Title cannot be empty.");
    });

    it("should return validation errors when description is not a string", async function () {
      const response = await chai
        .request(app)
        .put(`/api/tasks/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Task",
          description: 12345,
          status: "Completed",
          dueDate: "2024-12-31T23:59:59.000Z",
        });

      expect(response.status).to.equal(422);
      expect(response.body)
        .to.have.property("message")
        .that.includes("Description must be a string.");
    });

    it("should pass validation when all fields are correct", async function () {
      const task = await Task.create({
        title: "Task 1",
        userId,
      });

      const response = await chai
        .request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Task",
          description: "Updated description",
          status: "Completed",
          dueDate: "2024-12-31T23:59:59.000Z",
        });

      expect(response.status).to.equal(200);
      expect(response.body)
        .to.have.property("title")
        .that.equals("Updated Task");
      expect(response.body).to.have.property("status").that.equals("Completed");
    });
  });
});
