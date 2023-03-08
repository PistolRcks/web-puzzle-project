import Supertest from 'supertest';
import * as Crypto from 'crypto';
import { db } from '../../server/db';

const myApp = require("../../server/index");
const request = Supertest(myApp);

// mock the database module AND hashing
jest.mock("../../server/db");
jest.mock("crypto");

// mock data hashing function
Crypto.pbkdf2.mockImplementation((pass, salt, iter, keylen, digest, callback) => {
  // assuming the only password we'll be using is "letmein"!
  if (pass === "letmein") {
    // return the "hashed" password
    callback(null, Buffer.from("hashed", "utf8"));
  } else {
    // return an incorrect password
    callback(null, Buffer.from("badPassword", "utf8"));
  }
});

describe("Tests for user login", () => {
  beforeAll(() => {
    /*
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
    */
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
      callback(null, null);
    });

    const response = await request.post("/api/login").send({
      username: "bob",
      password: "letmein",
    });

    console.log(response.text)

    expect(db.get.mock.lastCall[0]).toBe(
      "SELECT hashed_password, salt FROM User WHERE username = ?"
    );
    expect(db.get.mock.lastCall[1]).toEqual("bob");
    expect(response.statusCode).toEqual(500);
  });

  it("login - Successful login 200", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      callback(null, { hashed_password: Buffer.from("hashed", "utf8"), salt: "salt" });
    });

    const response = await request.post("/api/login").send({
      username: "alice",
      password: "letmein",
    });

    expect(db.get.mock.lastCall[0]).toBe(
      "SELECT hashed_password, salt FROM User WHERE username = ?"
    );
    expect(db.get.mock.lastCall[1]).toEqual("alice");
    expect(response.statusCode).toEqual(200);
  });

  it("login - Unauthorized login 401", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      callback(null, { hashed_password: Buffer.from("hashed", "utf8"), salt: "salt" });
    });

    const response = await request.post("/api/login").send({
      username: "alice",
      password: "letmeout",
    });

    expect(db.get.mock.lastCall[0]).toBe(
      "SELECT hashed_password, salt FROM User WHERE username = ?"
    );
    expect(db.get.mock.lastCall[1]).toEqual("alice");
    expect(response.statusCode).toEqual(401);
  });
});
