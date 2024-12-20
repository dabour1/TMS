const chai = require("chai");
const chaiHttp = require("chai-http");
const { connectDB, closeDB, clearDB } = require("./setup");
const app = require("../app");
const User = require("../Models/UserSchema");
const sinon = require("sinon");
const { expect } = chai;
chai.use(chaiHttp);

describe("User API", () => {
  before(async () => {
    await connectDB();
  });

  after(async () => {
    await closeDB();
  });

  afterEach(async () => {
    await clearDB();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await chai.request(app).post("/api/auth/register").send({
        name: "ahmed",
        email: "test@example.com",
        password: "a@123456789",
      });
      expect(res).to.have.status(201);
      expect(res.body)
        .to.have.property("message")
        .that.includes("User registered successfully.");
    });

    it("should return an error for duplicate email", async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password@123",
      });

      const res = await chai.request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password@123",
      });
      expect(res).to.have.status(400);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Email already in use");
    });
  });

  it("should handle server error while registering ", async () => {
    sinon.stub(User.prototype, "save").throws(new Error("Database error"));

    const res = await chai
      .request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "password@123",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(500);
    expect(res.body).to.have.property("message").that.includes("Server error");

    sinon.restore();
  });

  describe("POST /api/auth/login", () => {
    it("should log in an existing user", async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password@123",
      });

      const res = await chai.request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password@123",
      });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("token");
    });

    it("should return an error for User not found", async () => {
      const res = await chai.request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });
      expect(res).to.have.status(404);
      expect(res.body)
        .to.have.property("message")
        .that.includes("User not found");
    });
    it("should return an error for invalid credentials", async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "password@123",
      });
      const res = await chai.request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });
      expect(res).to.have.status(400);
      expect(res.body)
        .to.have.property("message")
        .that.includes("Invalid credentials");
    });
  });
  it("should handle server error while login", async () => {
    sinon.stub(User, "findOne").throws(new Error("Database error"));

    const res = await chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "password@123",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(500);
    expect(res.body).to.have.property("message").that.includes("Server error");

    sinon.restore();
  });
});
