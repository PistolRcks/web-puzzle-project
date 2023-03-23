import Supertest from "supertest";
import { db } from "../../server/db";

const myApp = require("../../server/index");
const request = Supertest(myApp);

// mock the database module AND hashing
jest.mock("../../server/db");
jest.mock("crypto", () => {
  return {
    ...jest.requireActual("crypto"),
    pbkdf2: (pass, salt, iter, keylen, digest, callback) => {
      // assuming the only password we'll be using is "letmein"!
     callback(null, Buffer.from(pass, "utf8"));
    }
  }
});

describe("Tests for POST at /api/login", () => {
  const correctPassword = "correctPassword";
  const incorrectPassword = "incorrectPassword";
  
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("400 - Missing Password", async () => {
    const response = await request.post("/api/login")
      .send({
        username: "missingPassword",
      });

    expect(response.statusCode).toEqual(400);
  });

  test("400 - Missing Username", async () => {
    const response = await request.post("/api/login")
      .send({
        password: "missingUsername",
      });

    expect(response.statusCode).toEqual(400);
  });

  test("500 - Invalid username", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      callback(null, null);
    });

    const response = await request.post("/api/login")
      .send({
        username: "bob",
        password: "letmein",
      });

    expect(db.get.mock.lastCall[0]).toBe("SELECT hashed_password, salt, user_id FROM User WHERE username = ?");
    expect(db.get.mock.lastCall[1]).toEqual("bob");
    expect(response.statusCode).toEqual(500);
  });

  it("401 - Unauthorized login", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      callback(null, {
        hashed_password: Buffer.from(correctPassword, "utf8"),
        salt: "salt",
        user_id: 1
      });
    });

    const response = await request.post("/api/login")
      .send({
        username: "alice",
        password: incorrectPassword,
      });

    expect(db.get.mock.lastCall[0]).toBe("SELECT hashed_password, salt, user_id FROM User WHERE username = ?");
    expect(db.get.mock.lastCall[1]).toEqual("alice");
    expect(response.statusCode).toEqual(401);
  });

  it("200 - Successful login", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      callback(null, {
        hashed_password: Buffer.from(correctPassword, "utf8"),
        salt: "salt",
        user_id: 1
      });
    });

    const response = await request.post("/api/login")
      .send({
        username: "alice",
        password: correctPassword,
      });

    expect(db.get.mock.lastCall[0]).toBe("SELECT hashed_password, salt, user_id FROM User WHERE username = ?");
    expect(db.get.mock.lastCall[1]).toEqual("alice");
    expect(response.statusCode).toEqual(200);
  });
});
