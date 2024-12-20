const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const connectDB = require("../db");
const expect = chai.expect;
describe("connectDB", () => {
  let connectStub;

  beforeEach(() => {
    connectStub = sinon.stub(mongoose, "connect");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should connect to the database successfully when not already connected", async () => {
    connectStub.resolves();

    await connectDB("mongodb://127.0.0.1:27017/test_db");

    expect(connectStub.calledOnce).to.be.true;
    expect(connectStub.calledWith("mongodb://127.0.0.1:27017/test_db")).to.be
      .true;
  });

  it("should log an error and exit on failure", async () => {
    const error = new Error("Connection failed");
    connectStub.rejects(error);

    const consoleErrorStub = sinon.stub(console, "error");
    const processExitStub = sinon.stub(process, "exit");

    try {
      await connectDB("mongodb://127.0.0.1:27017/test_db");
    } catch (err) {
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(
        consoleErrorStub.calledWith("Error connecting to database:", error)
      ).to.be.true;

      expect(processExitStub.calledOnce).to.be.true;
      expect(processExitStub.calledWith(1)).to.be.true;
    }

    consoleErrorStub.restore();
    processExitStub.restore();
  });
});
