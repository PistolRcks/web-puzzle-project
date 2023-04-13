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

describe("Tests for userInfo.js: getUserInfo", () => {
    test("200 - Normal operation", () => {

    })
    
    test("400 - User does not exist", () => {

    })

    test("500 - User info `db.get` error", () => {

    })

    test("500 - User_Puzzle info `db.get` error", () => {

    })
})

describe("Tests for userInfo.js: postUserInfo", () => {
    test("200 - Normal operation", () => {

    })
    
    test("400 - Password failed to meet requirements", () => {

    })
    
    test("500 - Password failed to be hashed", () => {

    })

    test("500 - Password failed to be updated in database", () => {

    })

    test("500 - `db.run` did not throw an error, but User was not updated", () => {
        
    })

    test("Non-200 - Password failed to be verified", () => {
        
    })
})