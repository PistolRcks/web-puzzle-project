const myApp = require("../../server/index");
const supertest = require("supertest");
const request = supertest(myApp);
describe("Tests for login.js", async () => {
  it("login - Missing Data 400", async () => {
    const response = await request.post("/api/login").send({
      username: "missingPassword",
    });

    expect(response.statusCode).toEqual(400);
  });
});
