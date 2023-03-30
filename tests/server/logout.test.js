import Supertest from "supertest";
import { Session } from "express-session";

const App = require("../../server/index");
const request = Supertest(App);

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

describe("Test /api/logout route", () => {
  test("Logout with session", async () => {
    const res = await request.post("/api/logout");
    expect(res.statusCode).toEqual(200); // we should get a redirect
  });

  test("Logout with error", async () => {
    // mock `Session.destroy()` to throw an error
    jest.spyOn(Session.prototype, "destroy").mockImplementation((callback) => {
      callback("Error!");
    });

    const res = await request.post("/api/logout");
    expect(res.statusCode).toEqual(500);
  });
});
