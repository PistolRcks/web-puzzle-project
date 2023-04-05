const { db } = require("../../server/db");
const crypto = require("crypto");

const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);

jest.mock("../../server/db");
jest.mock("../../server/api/login", () => {
  return {
    login: jest.fn((req, res) => { return res.status(200).send("OK") })
  }
});
// mock the middleware, specifically mock the auth check to "create" the session
jest.mock("../../server/middleware", () => {
  return {
    redirectBundleManifest: jest.fn((req, res, next) => {
      next();
    }),
    logRouteAndCheckAuthorization: jest.fn((req, res, next) => {
      req.session.userID = 1;
      req.session.username = 'alice';
      next();
    })
  }
})

jest.mock("crypto", () => {
  return {
    ...jest.requireActual("crypto"),
    pbkdf2: (pass, salt, iter, keylen, digest, callback) => {
      callback(null, Buffer.from(pass, "utf8"));
    }
  }
});

const missingParametersText = "Error: Username or password not set!";

describe("Tests for POST at /api/signup", () => {
  const route = "/api/signup";
  const username = "ThisUsernameIsValid";
  const password = "validPassword123";

  // block console logging
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("200 - Successful Insert", async () => {
    db.run = jest.fn((query, params, callback) => {
      callback(null, { lastID: 1 });
    });

    const response = await request.post(route)
      .send({
        username,
        password
      });

    expect(response.statusCode).toBe(200);
  });

  test("400 - Missing Username and Password", async () => {
    const response = await request.post(route);

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(missingParametersText);
  });

  test("400 - Missing Username", async () => {
    const response = await request.post(route)
      .send({
        password
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(missingParametersText);
  });

  test("400 - Missing Password", async () => {
    const response = await request.post(route)
      .send({
        username
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(missingParametersText);
  });

  test("400 - Invalid Username", async () => {
    const response = await request.post(route)
      .send({
        username: "un$",
        password: "Very1Epic!",
      });

    expect(response.statusCode).toBe(400);
  });

  test("400 - Invalid Password", async () => {
    const response = await request.post(route)
      .send({
        username: "usernameVeryEpic",
        password: "invalid"
      });

    expect(response.statusCode).toBe(400);
  });

  test("400 - Existing Username", async () => {
    db.run = jest.fn((query, params, callback) => {
      // errno 19 means the user already exists
      callback({ errno: 19 });
    });

    const response = await request.post(route)
      .send({
        username,
        password
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("Error: Username already exists!");
  });

  test("500 - Database Failure", async () => {
    db.run = jest.fn((query, params, callback) => {
      callback("Error");
    });

    const response = await request.post(route)
      .send({
        username,
        password
      });

    expect(response.statusCode).toBe(500);
    expect(response.text).toContain("Error: Failed to insert new user!\nSpecific error:")
  });

  test("500 - Internal Crypto Error during `crypto.pbkdf2`", async () => {
    jest.spyOn(crypto, "pbkdf2")
      .mockImplementationOnce((pass, salt, iter, keylen, digest, callback) => {
        callback("Error", null);
      });

    const response = await request.post(route)
      .send({
        username,
        password
      });

    expect(response.statusCode).toBe(500);
  });
});
