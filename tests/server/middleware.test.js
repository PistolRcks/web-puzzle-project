const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);

jest.mock("../../server/api/login", () => {
  return {
    login: jest.fn((req, response) => { return response.status(200).send("OK") })
  }
});

describe("Tests for middleware.js", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });
  
  test("200 - Session Authorized", async () => {
    const response = await request.post("/api/login");
    expect(response.statusCode).toBe(200);
  });

  test("401 - Unauthorized", async () => {
    const response = await request.get("/api/verify");
    expect(response.statusCode).toBe(401);
  });
});
