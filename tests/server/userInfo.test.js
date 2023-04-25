const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);
const crypto = require("crypto");
const { db } = require("../../server/db");

// mock the middleware, specifically mock the auth check to "create" the session
jest.mock("../../server/middleware", () => {
  return {
    redirectBundleManifest: jest.fn((req, res, next) => {
      next();
    }),
    logRouteAndCheckAuthorization: jest.fn((req, res, next) => {
      req.session.userID = 1;
      req.session.username = "alice";
      req.session.pfpSeed = 1;
      req.session.pfpBackgroundColor = "000000";
      next();
    }),
  };
});

jest.mock("crypto", () => {
  return {
    ...jest.requireActual("crypto"),
    pbkdf2: jest.fn((pass, salt, iter, keylen, digest, callback) => {
      callback(null, Buffer.from(pass, "utf8"));
    }),
  };
});

jest.mock("../../server/db");
jest.mock("../../server/api/login", () => {
  return {
    ...jest.requireActual("../../server/api/login"),
    verifyPassword: jest.fn((db, _username, _password, callback) => {
      if (_username === "alice" && _password === "origPass123") {
        callback(200, "OK", 1);
      } else {
        callback(401, "Incorrect Password", null);
      }
    }),
  };
});

describe("Tests for userInfo.js: getUserInfo", () => {
  const route = "/api/user/1";
  const username = "alice";
  const dbGetData = {
    username: username,
    profile_picture: "blob data...",
    profile_picture_top: 0,
    profile_picture_left: 0,
  };
  const dbAllData = [
    {
      puzzle_id: 0,
      title: "Test Puzzle",
      time: 1000,
    },
    {
      puzzle_id: 1,
      title: "Test Puzzle 2",
      time: 2000,
    },
  ];

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("200 - Normal operation", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback(null, dbGetData);
    });

    db.all = jest.fn((query, params, callback) => {
      callback(null, dbAllData);
    });

    const response = await request.get(route);
    const data = JSON.parse(response.text);

    expect(response.statusCode).toBe(200);

    // Should have the correct userID (is stored in an array)
    expect(db.get.mock.lastCall[1][0]).toEqual("1");

    // Only checking some data; should be formatted correctly
    expect(data.best_times).toEqual(dbAllData);
    expect(data.best_times).toHaveLength(2);
    expect(data.username).toEqual(username);

    // All keys should be there
    expect(Object.entries(data)).toHaveLength(7);
  });

  test("200 - Normal operation, but no User_Puzzles", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback(null, dbGetData);
    });

    db.all = jest.fn((query, params, callback) => {
      callback(null, null);
    });

    const response = await request.get(route);
    const data = JSON.parse(response.text);

    expect(response.statusCode).toBe(200);

    // Really, we only need to check the best_times
    expect(data.best_times).toEqual([]);
    expect(data.best_times).toHaveLength(0);

    // All keys should be there, though
    expect(Object.entries(data)).toHaveLength(7);
  });

  test("400 - User does not exist", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback(null, null);
    });

    const response = await request.get(route);
    const data = JSON.parse(response.text);

    expect(response.statusCode).toBe(400);
    expect(data.error).toEqual("User with ID 1 does not exist.");
    expect(Object.entries(data)).toHaveLength(1);
  });

  test("500 - User info `db.get` error", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback("Error!", null);
    });

    const response = await request.get(route);
    const data = JSON.parse(response.text);

    expect(response.statusCode).toBe(500);
    expect(data.error).toEqual("Error!");
    expect(Object.entries(data)).toHaveLength(1);
  });

  test("500 - User_Puzzle info `db.all` error", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback(null, dbGetData);
    });

    db.all = jest.fn((query, params, callback) => {
      callback("Error!", null);
    });

    const response = await request.get(route);
    const data = JSON.parse(response.text);

    expect(response.statusCode).toBe(500);
    expect(data.error).toEqual("Error!");
    expect(Object.entries(data)).toHaveLength(1);
  });
});

describe("Tests for userInfo.js: postUserInfo", () => {
  const route = "/api/user";
  const origPass = "origPass123";
  const newPass = "newPass123";
  const missingBody =
    "Error: Either 'old_password' or 'new_password' (or both) not found in the request body!";

  // console.log and console.error are already being spied upon in
  // the previous suite, so not necessary to do it again

  afterEach(() => {
    db.run.mockReset();
  });

  test("200 - Normal operation", async () => {
    db.run = jest.fn((query, params, callback) => {
      callback(null);
    });

    const response = await request
      .post(route)
      .send({ old_password: origPass, new_password: newPass });

    expect(response.statusCode).toBe(200);

    expect(crypto.pbkdf2.mock.lastCall[0]).toEqual(newPass);

    expect(response.text).toEqual("Successfully updated password!");
  });

  test("400 - request body empty", async () => {
    const response = await request.post(route).send({});

    expect(response.statusCode).toBe(400);
    expect(response.text).toEqual(missingBody);
  });

  test("400 - 'old_password' not in request body", async () => {
    const response = await request.post(route).send({ new_password: newPass });

    expect(response.statusCode).toBe(400);
    expect(response.text).toEqual(missingBody);
  });

  test("400 - 'new_password' not in request body", async () => {
    const response = await request.post(route).send({ old_password: origPass });

    expect(response.statusCode).toBe(400);
    expect(response.text).toEqual(missingBody);
  });

  test("400 - Password failed to meet requirements", async () => {
    const response = await request
      .post(route)
      .send({ old_password: origPass, new_password: "badPass" });

    expect(response.statusCode).toBe(400);
    // I don't want to look at the error responses of `checkPasswordServer`,
    // so we're just expecting *some* text here
    expect(response.text).toBeTruthy();
  });

  test("500 - Password failed to be hashed", async () => {
    crypto.pbkdf2.mockImplementationOnce(
      (pass, salt, iter, keylen, digest, callback) => {
        callback("Error!", null);
      }
    );

    const response = await request
      .post(route)
      .send({ old_password: origPass, new_password: newPass });

    expect(response.statusCode).toBe(500);
    expect(response.text).toEqual("Error!");
  });

  test("500 - Password failed to be updated in database", async () => {
    db.run = jest.fn((query, params, callback) => {
      callback("Error!");
    });

    const response = await request
      .post(route)
      .send({ old_password: origPass, new_password: newPass });

    expect(response.statusCode).toBe(500);
    expect(response.text).toEqual("Error!");
  });

  test("Non-200 - Password failed to be verified", async () => {
    const response = await request
      .post(route)
      .send({ old_password: "BadPass", new_password: newPass });

    console.log(response.text);

    expect(response.statusCode).toBe(401);
    expect(response.text).toEqual("Incorrect Password");
  });
});