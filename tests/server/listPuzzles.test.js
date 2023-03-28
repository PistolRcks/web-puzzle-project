import { db } from "../../server/db";

const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app)

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
    })
  }
});

describe("Puzzles endpoint", () => {
  const route = "/api/listPuzzles";
  const rows = [
    {
      puzzle_id: 1,
      title: "Title",
      description: "Description"
    },
    {
      puzzle_id: 2,
      title: "Title 2",
      description: "Description 2"
    }
  ]

  const userPuzzleCompletion = [
    {
      progress: 1,
      puzzle_id: 1
    }
  ]

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("200 - Success", async () => {
    jest.spyOn(db, "all").mockImplementationOnce((query, callback) => {
      callback(null, rows)
    })

    jest.spyOn(db, "all").mockImplementationOnce((query, callback) => {
      callback(null, userPuzzleCompletion)
    })

    const response = await request.get(route);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      {
        userID: 1,
        username: 'alice',
        puzzles: rows,
        userPuzzleCompletion
      });
  });

  test("500 - Puzzle Table Error", async () => {
    jest.spyOn(db, "all").mockImplementationOnce((query, callback) => {
      callback("Error", null)
    });

    const response = await request.get(route);

    expect(response.statusCode).toBe(500);
  });

  test("500 - User_Puzzle Table Error", async () => {
    jest.spyOn(db, "all").mockImplementationOnce((query, callback) => {
      callback(null, rows)
    });

    jest.spyOn(db, "all").mockImplementationOnce((query, callback) => {
      callback("Error", null)
    });

    const response = await request.get(route);

    expect(response.statusCode).toBe(500);
  });
});
