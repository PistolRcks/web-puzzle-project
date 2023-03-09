const supertest = require("supertest");

const app = require("../../server/index");
const request = supertest(app);

describe("Tests for middleware.js", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  test("Tests for logRouteAndCheckAuthorization unauthorized user", async () => {
    const response = await request.get("/api/verify");
    expect(response.statusCode).toBe(401);
  })

  // test("Redirect in redirectBundleManifest", async () => {
  //   const response = await request.get("/Puzzle/Selection/bundle.js");

  //   expect(console.log).toHaveBeenCalledWith("GET at /Puzzle/Selection/bundle.js");
  //   expect(console.log).toHaveBeenCalledWith("GET at /bundle.js");
  // })
})
