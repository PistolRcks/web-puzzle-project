const { db } = require("../../server/db");

const app = require("../../server/index");
const Supertest = require("supertest");
const request = Supertest(app);

jest.mock("../../server/db");

describe("Tests for POST at /api/googleLogin", () => {
  const route = "/api/googleLogin";
  const googleIdToken = "usernameVeryCool1";
  const noGoogleID = "Error: Google Id Not Set!";

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("200 - New Google Login", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback(null, null);
    });

    db.run = jest.fn((query, params, callback) => {
      callback(null, { lastID: 1});
    });

    const response = await request.post(route)
      .send({
        googleIdToken
      });

      expect(response.statusCode).toBe(200);
  });

  test("200 - User has previously logged in with Google", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback(null, { user_id: 1 });
    });

    const response = await request.post(route)
      .send({
        googleIdToken
      });

    expect(response.statusCode).toBe(200);
  });

  test("400 - Missing Google Token", async () => {
    const response = await request.post(route)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.text).toBe(noGoogleID);
  });

  test("500 - db.get Error", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback("Error", null);
    });

    const response = await request.post(route)
      .send({
        googleIdToken
      });

      expect(response.statusCode).toBe(500);
  });

  test("500 - db.run Error", async () => {
    db.get = jest.fn((query, params, callback) => {
      callback(null, null);
    });

    db.run = jest.fn((query, params, callback) => {
      callback("Error", null);
    });

    const response = await request.post(route)
      .send({
        googleIdToken
      });

      expect(response.statusCode).toBe(500);
      expect(response.text).toContain("Error: Failed to insert new user!\nSpecific error:")
  });
});