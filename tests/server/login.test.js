const myApp = require("../../server/index");
const supertest = require("supertest");
const request = supertest(myApp);
const sqlite3 = require("sqlite3");
const Crypto = require("crypto");

// mock the database module
jest.mock("../../server/db", () => {
  const original = jest.requireActual("../../server/db");
  return {
    ...original,
    get: jest.fn()
  }
})

const { db } = require("../../server/db");

describe("Tests for user login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("login - Missing Password 400", async () => {
    const response = await request.post("/api/login").send({
      username: "missingPassword",
    });

    expect(response.statusCode).toEqual(400);
  });

  it("login - Missing Username 400", async () => {
    const response = await request.post("/api/login").send({
      password: "missingUsername",
    });

    expect(response.statusCode).toEqual(400);
  });

  it("login - Invalid username 500", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      const lastCall = db.get.mock.calls[db.get.mock.calls.length - 1];
      expect(lastCall[0]).toBe(
        "SELECT hashed_password, salt FROM User WHERE username = ?"
      );
      expect(lastCall[1]).toEqual("bob");
      callback(null, { hashed_password: "hashed", salt: "salt" });
    });

    const response = await request.post("/api/login").send({
      username: "bob",
      password: "letmein",
    });

    expect(response.statusCode).toEqual(500);
  });

  it("login - Successful login 200", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      const lastCall = db.get.mock.calls[db.get.mock.calls.length - 1];
      expect(lastCall[0]).toBe(
        "SELECT hashed_password, salt FROM User WHERE username = ?"
      );
      expect(lastCall[1]).toEqual("alice");
      callback(null, { hashed_password: "hashed", salt: "salt" });
    });

    const response = await request.post("/api/login").send({
      username: "alice",
      password: "letmein",
    });

    expect(response.statusCode).toEqual(200);
  });

  it("login - Unauthorized login 401", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      const lastCall = db.get.mock.calls[db.get.mock.calls.length - 1];
      expect(lastCall[0]).toBe(
        "SELECT hashed_password, salt FROM User WHERE username = ?"
      );
      expect(lastCall[1]).toEqual("alice");
      callback(null, { hashed_password: "hashed", salt: "salt" });
    });

    const response = await request.post("/api/login").send({
      username: "alice",
      password: "letmeout",
    });

    expect(response.statusCode).toEqual(401);
  });
});
