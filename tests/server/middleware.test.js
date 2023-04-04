/**
 * @jest-environment node
 */

const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);

jest.mock("../../server/api/login", () => {
  return {
    login: jest.fn((req, res) => { return res.status(200).send("OK") })
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

  test("302 - File Redirect - Get bundle.js", async () => {
    const response = await request.get('/Puzzle/Selection/bundle.js');
    expect(response.statusCode).toBe(302);
  });

  test("302 - Image Redirect - Get check.png", async () => {
    const response = await request.get('/Puzzle/Selection/check.png');
    expect(response.statusCode).toBe(302);
  });

  test("401 - Unauthorized", async () => {
    const response = await request.get("/api/verify");
    expect(response.statusCode).toBe(401);
  });
});
