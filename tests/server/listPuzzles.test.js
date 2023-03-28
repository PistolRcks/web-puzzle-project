import { db } from "../../server/db";

const app = require("../../server/index");
const request = require("supertest");

jest.mock("../../server/db");

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

/**
 * Helper function to insert test puzzles into db
 * @param {int} k - Number of test puzzles to insert
 * @returns nothing
 */
function dataHelper(k) {
  db.run(
    `INSERT INTO Puzzle VALUES (1, "test puzzle 1", "test description 1")`
  );

  db.run(`INSERT INTO User_Puzzle VALUES (1, 1, NULL, 1)`)
}

// block console logging, generate mock data
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => { });
  jest.spyOn(console, "error").mockImplementation(() => { });
  dataHelper();
});

describe("Puzzles endpoint", () => {
  test("Response 200 - successful query", async () => {
    const res = await request(app).get("/api/listPuzzles");
    console.log(res.body)

    expect(res.statusCode).toEqual(200); // status code should be 200
    expect(res.body).toEqual(
      {
        userID: 1,
        username: 'alice',
        puzzles: [
          {
            puzzle_id: 1,
            title: "test puzzle 1",
            description: "test description 1",
          }
        ],
        userPuzzleCompletion: [
          {
            progress: 1,
            puzzle_id: 1
          }
        ]
      });
  });
});
