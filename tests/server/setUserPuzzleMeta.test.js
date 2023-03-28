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

  beforeEach(() => {
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

  test("Error 500 - Internal SQLite3 Error during `db.get`", async () => {
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

  test("Error 500 - Internal SQLite3 Error during `db.run`", async () => {
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

  test("Response 200 - Standard use", async () => {
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
