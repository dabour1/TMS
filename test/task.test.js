const chai = require("chai");
const chaiHttp = require("chai-http");
const { connectDB, closeDB, clearDB } = require("./setup");
const app = require("../app");
const User = require("../Models/UserSchema");
const Task = require("../Models/TaskSchema");
const sinon = require("sinon");
const { expect } = chai;
chai.use(chaiHttp);

describe("Task API", () => {
  let token, userId;

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

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const res = await chai
        .request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          description: "Test task description",
        });
      expect(res).to.have.status(201);
      expect(res.body).to.have.property("title", "Test Task");
    });
  });

  describe("POST /api/tasks (Server Error)", () => {
    it("should handle server error while creating a task", async () => {
      sinon.stub(Task.prototype, "save").throws(new Error("Database error"));

      const res = await chai
        .request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          description: "Test task description",
        });

      expect(res).to.have.status(500);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Server error");

      sinon.restore();
    });
  });
  describe("GET /api/tasks", () => {
    it("should retrieve tasks created by the user", async () => {
      await Task.create({
        title: "Task 1",
        userId,
      });

      const res = await chai
        .request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an("array").that.has.lengthOf(1);
    });
  });
  describe("GET /api/tasks (Server Error)", () => {
    it("should handle server error while retrieving tasks", async () => {
      sinon.stub(Task, "find").throws(new Error("Database error"));

      const res = await chai
        .request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(500);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Server error");

      sinon.restore();
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("should update a task", async () => {
      const task = await Task.create({
        title: "Task 1",
        userId,
      });

      const res = await chai
        .request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "Completed",
        });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("status", "Completed");
    });
  });
  describe("PUT /api/tasks/:id(Task not found)", () => {
    it("should handle Task not found error while updating a task", async () => {
      const res = await chai
        .request(app)
        .put(`/api/tasks/6764789f8e08be0a103e2d0f`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "Completed",
        });
      expect(res).to.have.status(404);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Task not found");
    });
  });
  describe("PUT /api/tasks/:id (Server Error)", () => {
    it("should handle server error while updating a task", async () => {
      const task = await Task.create({
        title: "Task 1",
        userId,
      });

      sinon.stub(Task, "findOneAndUpdate").throws(new Error("Database error"));

      const res = await chai
        .request(app)
        .put(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          status: "Completed",
        });

      expect(res).to.have.status(500);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Server error");

      sinon.restore();
    });
  });
  describe("DELETE /api/tasks/:id", () => {
    it("should delete a task", async () => {
      const task = await Task.create({
        title: "Task 1",
        userId,
      });

      const res = await chai
        .request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Task deleted");
    });
  });
  describe("DELETE /api/tasks/:id(Task not found)", () => {
    it("should handle Task not found error while deleting a task", async () => {
      const res = await chai
        .request(app)
        .delete(`/api/tasks/6764789f8e08be0a103e2d0f`)
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(404);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Task not found");
    });
  });
  describe("DELETE /api/tasks/:id (Server Error)", () => {
    it("should handle server error while deleting a task", async () => {
      const task = await Task.create({
        title: "Task 1",
        userId,
      });

      sinon.stub(Task, "findOneAndDelete").throws(new Error("Database error"));

      const res = await chai
        .request(app)
        .delete(`/api/tasks/${task._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res).to.have.status(500);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Server error");

      sinon.restore();
    });
  });
});
