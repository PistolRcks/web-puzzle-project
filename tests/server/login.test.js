const { db } = require( "../../server/db");
const crypto = require("crypto");

const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);

// mock the database module
jest.mock("../../server/db");

jest.mock("crypto", () => {
  return {
    ...jest.requireActual("crypto"),
    pbkdf2: jest.fn((pass, salt, iter, keylen, digest, callback) => {
     callback(null, Buffer.from(pass, "utf8"));
    })
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
      req.session.promptUser = true;
      req.session.oauthID = 1234;
      next();
    })
  }
})

describe("Tests for POST at /api/login", () => {
  const username = "alice";
  const userID = 1;
  const password = "password";
  const incorrectPassword = "incorrectPassword";
  const route = "/api/login";
  
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("200 - Successful login", async () => {
    // mock the database response
    db.get = jest.fn().mockImplementationOnce((query, params, callback) => {
      callback(null, {
        hashed_password: Buffer.from(password, "utf8"),
        salt: "salt",
        user_id: userID
      });
    }).mockImplementationOnce((query, params, callback) => {
      callback(null, null);
    }).mockImplementationOnce((query, params, callback) => {
      callback(null, null);
    })

    const response = await request.post(route)
      .send({
        username,
        password,
      });

    expect(response.statusCode).toBe(200);
  });

  test("400 - Missing Password", async () => {
    const response = await request.post(route)
      .send({
        username,
      });

    expect(response.statusCode).toBe(400);
  });

  test("400 - Missing Username", async () => {
    const response = await request.post(route)
      .send({
        password,
      });

    expect(response.statusCode).toBe(400);
  });

  test("401 - Unauthorized login", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      callback(null, {
        hashed_password: Buffer.from(password, "utf8"),
        salt: "salt",
        user_id: userID
      });
    });

    const response = await request.post(route)
      .send({
        username,
        password: incorrectPassword,
      });

    expect(db.get.mock.lastCall[1]).toBe(username);
    expect(response.statusCode).toBe(401);
  });

  test("500 - Error in deleteOauth function", async () => {
    db.get = jest.fn().mockImplementationOnce((query, params, callback) => {
      callback(null, {
        hashed_password: Buffer.from(password, "utf8"),
        salt: "salt",
        user_id: userID
      });
    }).mockImplementationOnce((query, params, callback) => {
      callback("Error");
    });

    const response = await request.post(route)
      .send({
        username,
        password
      });

    expect(response.statusCode).toBe(500);
  });

  test("500 - Error in updateUserOauth function", async () => {
    db.get = jest.fn().mockImplementationOnce((query, params, callback) => {
      callback(null, {
        hashed_password: Buffer.from(password, "utf8"),
        salt: "salt",
        user_id: userID
      });
    }).mockImplementationOnce((query, params, callback) => {
      callback(null, null);
    }).mockImplementationOnce((query, params, callback) => {
      callback("Error");
    });

    const response = await request.post(route)
      .send({
        username,
        password
      });

    expect(response.statusCode).toBe(500);
  });

  test("500 - Database Error", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback("Error", null);
    });

    const response = await request.post(route)
      .send({
        username,
        password
      })

      expect(db.get.mock.lastCall[1]).toBe(username);
      expect(response.statusCode).toBe(500);
  });

  test("500 - Internal Crypto Error during `crypto.pbkdf2`", async () => {
    jest.spyOn(crypto, "pbkdf2")
      .mockImplementationOnce((pass, salt, iter, keylen, digest, callback) => {
        callback("Error", null);
      });

    db.get = jest.fn((query, params, callback) => {
      callback(null, {
        hashed_password: Buffer.from(password, "utf8"),
        salt: "salt",
        user_id: userID
      });
    });

    const response = await request.post(route)
      .send({
        username,
        password,
      });

      expect(response.statusCode).toBe(500);
  });

  test("500 - Username Not Found", async () => {
    // mock the database response
    db.get = jest.fn((query, params, callback) => {
      callback(null, null);
    });

    const response = await request.post(route)
      .send({
        username,
        password,
      });

    expect(db.get.mock.lastCall[0]).toBe("SELECT hashed_password, salt, user_id, default_pfp_seed, default_pfp_color FROM User WHERE username = ?");
    expect(db.get.mock.lastCall[1]).toBe(username);
    expect(response.statusCode).toBe(500);
  });
});
