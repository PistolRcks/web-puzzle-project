const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);

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

describe("Tests for index.test.js", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });
  
  test("200 - File returned", async () => {
    const response = await request.get("/Puzzle/Selection");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Web Puzzle");
  })
});