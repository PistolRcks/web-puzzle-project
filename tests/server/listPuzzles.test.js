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
  for (let i = 1; i <= k; i++) {
    db.run(
      `INSERT INTO Puzzle VALUES (${i}, "test puzzle ${i}", "test description ${i}")`
    );
  }

  db.run(`INSERT INTO User_Puzzle VALUES (1, 1, NULL, 1)`)
}

// block console logging, generate mock data
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  dataHelper(5);
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
            },
            {
              puzzle_id: 2,
              title: "test puzzle 2",
              description: "test description 2",
            },
            {
              puzzle_id: 3,
              title: "test puzzle 3",
              description: "test description 3",
            },
            {
              puzzle_id: 4,
              title: "test puzzle 4",
              description: "test description 4",
            },
            {
              puzzle_id: 5,
              title: "test puzzle 5",
              description: "test description 5",
            },
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
