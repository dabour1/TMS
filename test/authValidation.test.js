const chai = require("chai");
const supertest = require("supertest");
const { expect } = chai;
const { connectDB, closeDB, clearDB } = require("./setup");
const app = require("../app");

const User = require("../Models/UserSchema");
describe("User Validation", function () {
  afterEach(async () => {
    await clearDB();
  });
  describe("POST /api/auth/register", function () {
    it("should return validation errors when name is missing", async function () {
      const response = await supertest(app).post("/api/auth/register").send({
        email: "test@example.com",
        password: "Test@1234",
      });

      expect(response.status).to.equal(422);
      expect(response.body)
        .to.have.property("message")
        .that.includes("name is required");
      expect(response.body)
        .to.have.property("message")
        .that.includes("name is required");
    });

    it("should return validation errors when email is invalid", async function () {
      const response = await supertest(app).post("/api/auth/register").send({
        name: "JohnDoe",
        email: "invalidemail",
        password: "Test@1234",
      });

      expect(response.status).to.equal(422);
      expect(response.body)
        .to.have.property("message")
        .that.includes("Please provide a valid email address");
    });

    it("should return validation errors when password is too weak", async function () {
      const response = await supertest(app).post("/api/auth/register").send({
        name: "JohnDoe",
        email: "test@example.com",
        password: "12345",
      });

      expect(response.status).to.equal(422);
      expect(response.body)
        .to.have.property("message")
        .that.includes("Password must be at least 6 characters long");
    });

    it("should pass validation when all fields are correct", async function () {
      const response = await supertest(app).post("/api/auth/register").send({
        name: "JohnDoe",
        email: "test@example.com",
        password: "Test@1234",
      });

      expect(response.status).to.equal(201);
      expect(response.body)
        .to.have.property("message")
        .that.includes("User registered successfully");
    });

    describe("POST /api/auth/login", function () {
      it("should return validation errors when email is invalid", async function () {
        const response = await supertest(app).post("/api/auth/login").send({
          email: "invalidemail",
          password: "Test@1234",
        });

        expect(response.status).to.equal(422);
        expect(response.body)
          .to.have.property("message")
          .that.includes("Please provide a valid email address");
      });

      it("should return validation errors when password is missing", async function () {
        const response = await supertest(app).post("/api/auth/login").send({
          email: "test@example.com",
        });

        expect(response.status).to.equal(422);
        expect(response.body)
          .to.have.property("message")
          .that.includes("Password is required.");
      });

      it("should pass validation when all fields are correct", async function () {
        await User.create({
          name: "Test User",
          email: "test@example.com",
          password: "password@123",
        });
        const response = await supertest(app).post("/api/auth/login").send({
          email: "test@example.com",
          password: "password@123",
        });

        expect(response.status).to.equal(200);
        expect(response.body)
          .to.have.property("state")
          .that.includes("Authenticated");
      });
    });
  });
});
