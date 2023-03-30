const { db } = require("../../server/db");

const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);

// mock the two database calls
jest.mock("../../server/db");
// mock the middleware, specifically mock the auth check to "create" the session
jest.mock("../../server/middleware", () => {
  return {
    redirectBundleManifest: jest.fn((req, res, next) => {
      next();
    }),
    logRouteAndCheckAuthorization: jest.fn((req, res, next) => {
      req.session.userID = 1;
      req.session.username = "alice";
      next();
    }),
  };
});

describe("Tests /api/userPuzzleMeta route", () => {
  const route = "/api/userPuzzleMeta";
  const invalidInput = `Error: Malformed input - required key "progress", "puzzle_id", or "time" not found in request body.`;
  const invalidType = `Error: Malformed input - key "progress", "puzzle_id", or "time" is not a Number.`;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("200 - User_Puzzle inserted", async () => {
    db.get = jest.fn().mockImplementationOnce((req, opts, callback) => {
      // first db.get "select * from User_Puzzle..."
      // should return nothing
      callback(null, null);
    }).mockImplementationOnce((req, opts, callback) => {
      // second db.get "select * from Puzzle..."
      callback(null, ["yes it exists"]);
    })

    db.run = jest.fn((req, opts, callback) => {
      // have the callback throw no error
      callback(null, null);
    });

    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe(`User_Puzzle relation between user_id 1 and puzzle_id 1 successfully created.`);
  });

  test("200 - User_Puzzle updated", async () => {
    db.get = jest.fn((req, opts, callback) => {
      // have the callback return the row
      callback(null, ["There's data here!"]);
    });

    db.run = jest.fn((req, opts, callback) => {
      // have the callback throw no error
      callback(null);
    });

    const res = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: 1,
        time: 0,
      });

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(`User_Puzzle relation between user_id 1 and puzzle_id 1 successfully updated.`);
  });

  test("400 - Missing Progress", async () => {
    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(invalidInput);
  });

  test("400 - Missing PuzzleID", async () => {
    const response = await request.post(route)
      .send({
        progress: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(invalidInput);
  });

  test("400 - Missing Time", async () => {
    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: 1,
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(invalidInput);
  });
  
  test("400 - Progress is the wrong type", async () => {
    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: "a",
        time: 0,
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(invalidType);
  });

  test("400 - PuzzleID is the wrong type", async () => {
    const response = await request.post(route)
      .send({
        puzzle_id: "a",
        progress: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(invalidType);
  });
  
  test("400 - Time is the wrong type", async () => {
    const response = await request.post(route).send({
      puzzle_id: 1,
      progress: 1,
      time: "a",
    });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(invalidType);
  });
  
  test("500 - Internal SQLite3 Error during first `db.get`", async () => {
    db.get = jest.fn((req, opts, callback) => {
      callback("Error", null);
    });

    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Error");
  });
  
  test("500 - Internal SQLite3 Error during second `db.get`", async () => {
    db.get = jest.fn().mockImplementationOnce((req, opts, callback) => {
      callback(null, null);
    }).mockImplementationOnce((req, opts, callback) => {
      callback("Error", null);
    });

    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Error");
  });

  test("500 - Internal SQLite3 Error during `db.run` during update", async () => {
    db.get = jest.fn().mockImplementationOnce((req, opts, callback) => {
      callback(null, ["There's data here!"]);
    });

    db.run = jest.fn().mockImplementationOnce((req, opts, callback) => {
      callback("Error", null);
    });

    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Error");
  });
  
  test("500 - Internal SQLite3 Error during `db.run` during insert", async () => {
    db.get = jest.fn().mockImplementationOnce((req, opts, callback) => {
      // first db.get "select * from User_Puzzle..."
      // should return nothing
      callback(null, null);
    }).mockImplementationOnce((req, opts, callback) => {
      // second db.get "select * from Puzzle..."
      callback(null, ["yes it exists"]);
    })

    db.run = jest.fn((req, opts, callback) => {
      callback("Error", null);
    });

    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(500);
    expect(response.text).toBe("Error");
  });
  
  test("500 - Puzzle does not exist", async () => {
    db.get = jest.fn().mockImplementationOnce((req, opts, callback) => {
      // first db.get "select * from User_Puzzle..."
      // should return nothing
      callback(null, null);
    }).mockImplementationOnce((req, opts, callback) => {
      // second db.get "select * from Puzzle..."
      callback(null, null);
    })

    const response = await request.post(route)
      .send({
        puzzle_id: 1,
        progress: 1,
        time: 0,
      });

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(`Puzzle with "puzzle_id" 1 does not exist. Not inserting.`);
  });
});
