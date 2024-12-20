const chai = require("chai");
const { expect } = chai;
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const User = require("../Models/UserSchema");

describe("User Schema", () => {
  let mongoServer;

  before(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should hash the password before saving the user", async () => {
    const plainPassword = "password123";
    const user = new User({
      name: "Test User",
      email: "test@example.com",
      password: plainPassword,
    });

    await user.save();

    expect(user.password).to.not.equal(plainPassword);
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    expect(isMatch).to.be.true;
  });

  it("should not hash the password if it is not modified", async () => {
    const user = new User({
      name: "Test User",
      email: "test1@example.com",
      password: "password123",
    });

    await user.save();
    const originalPasswordHash = user.password;

    user.name = "Updated Name";
    await user.save();

    expect(user.password).to.equal(originalPasswordHash);
  });

  it("should throw a validation error if required fields are missing", async () => {
    const user = new User({});

    try {
      await user.save();
    } catch (err) {
      expect(err).to.exist;
      expect(err.errors).to.have.property("name");
      expect(err.errors).to.have.property("email");
      expect(err.errors).to.have.property("password");
    }
  });

  it("should enforce unique email addresses", async () => {
    const user1 = new User({
      name: "User One",
      email: "unique@example.com",
      password: "password123",
    });

    const user2 = new User({
      name: "User Two",
      email: "unique@example.com",
      password: "password123",
    });

    await user1.save();
    try {
      await user2.save();
    } catch (err) {
      expect(err).to.exist;
      expect(err.code).to.equal(11000);
    }
  });
});
