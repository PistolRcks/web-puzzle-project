const { Session } = require("express-session");

const App = require("../../server/index");
const Supertest = require("supertest");
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

describe("Tests for POST at /api/logout", () => {
  const route = "/api/logout";

  test("200 - Logged Out", async () => {
    const response = await request.post(route);
    expect(response.statusCode).toBe(200); // we should get a redirect
  });

  test("Logout with error", async () => {
    // mock `Session.destroy()` to throw an error
    jest.spyOn(Session.prototype, "destroy").mockImplementation((callback) => {
      callback("Error");
    });

    const response = await request.post(route);
    expect(response.statusCode).toBe(500);
  });
});
