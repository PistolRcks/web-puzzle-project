import { db } from "../../server/db";
import Supertest from "supertest";

const app = require("../../server/index");
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
  const badInput = `Error: Malformed input - required key "progress", "puzzle_id", or "time" not found in request body.`;
  const badType = `Error: Malformed input - key "progress", "puzzle_id", or "time" is not a Number.`;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("Error 400 - Missing `progress` in `req.body`", async () => {
    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(badInput);
  });

  test("Error 400 - Missing `time` in `req.body`", async () => {
    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(badInput);
  });

  test("Error 400 - Missing `puzzle_id` in `req.body`", async () => {
    const res = await request.post("/api/userPuzzleMeta").send({
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(badInput);
  });
  
  test("Error 400 - `puzzle_id` mistyped", async () => {
    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: "a",
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(badType);
  });

  test("Error 400 - `progress` mistyped", async () => {
    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: "a",
      time: 0,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(badType);
  });
  
  test("Error 400 - `time` mistyped", async () => {
    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
      time: "a",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(badType);
  });
  
  test("Error 500 - Internal SQLite3 Error during first `db.get`", async () => {
    db.get = jest.fn((req, opts, callback) => {
      // have the callback throw an error
      callback("Error!", null);
    });

    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("Error!");
  });
  
  test("Error 500 - Internal SQLite3 Error during second `db.get`", async () => {
    db.get = jest.fn().mockImplementationOnce((req, opts, callback) => {
      // don't throw an error during the first, but also don't give a row
      callback(null, null);
    }).mockImplementationOnce((req, opts, callback) => {
      // and *now* we can throw an error
      callback("Error!", null);
    });

    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("Error!");
  });

  test("Error 500 - Internal SQLite3 Error during `db.run` during update", async () => {
    db.get = jest.fn((req, opts, callback) => {
      // have the callback return the row
      callback(null, ["There's data here!"]);
    });

    db.run = jest.fn((req, opts, callback) => {
      // have the callback throw an error
      callback("Error!");
    });

    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("Error!");
  });
  
  test("Error 500 - Internal SQLite3 Error during `db.run` during insert", async () => {
    db.get = jest.fn().mockImplementationOnce((req, opts, callback) => {
      // first db.get "select * from User_Puzzle..."
      // should return nothing
      callback(null, null);
    }).mockImplementationOnce((req, opts, callback) => {
      // second db.get "select * from Puzzle..."
      callback(null, ["yes it exists"]);
    })

    db.run = jest.fn((req, opts, callback) => {
      // have the callback throw an error
      callback("Error!");
    });

    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("Error!");
  });
  
  test("Error 500 - `puzzle` does not exist", async () => {
    db.get = jest.fn().mockImplementationOnce((req, opts, callback) => {
      // first db.get "select * from User_Puzzle..."
      // should return nothing
      callback(null, null);
    }).mockImplementationOnce((req, opts, callback) => {
      // second db.get "select * from Puzzle..."
      callback(null, null);
    })

    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(`Puzzle with "puzzle_id" 1 does not exist. Not inserting.`);
  });
  
  test("Response 200 - User_Puzzle inserted", async () => {
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
      callback(null);
    });

    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(
      `User_Puzzle relation between user_id 1 and puzzle_id 1 successfully created.`
    );
  });

  test("Response 200 - User_Puzzle updated", async () => {
    db.get = jest.fn((req, opts, callback) => {
      // have the callback return the row
      callback(null, ["There's data here!"]);
    });

    db.run = jest.fn((req, opts, callback) => {
      // have the callback throw no error
      callback(null);
    });

    const res = await request.post("/api/userPuzzleMeta").send({
      puzzle_id: 1,
      progress: 1,
      time: 0,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(
      `User_Puzzle relation between user_id 1 and puzzle_id 1 successfully updated.`
    );
  });
});
