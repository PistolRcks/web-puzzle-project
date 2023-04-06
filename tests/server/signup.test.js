import { insertUser } from "../../server/api/signup";
import { db } from "../../server/db";
import * as Crypto from "crypto";
import Supertest from "supertest";

const App = require("../../server/index");
const request = Supertest(App);

jest.mock("../../server/db");
jest.mock("../../server/api/login", () => {
  return {
    login: jest.fn((req, res, next) => { return res.status(200).send("OK")})
  }
});

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

describe("Test insertUser", () => {
  var lastID = -1;

  beforeEach(async () => {
    // get the last user user_id
    await db.get("select max(user_id) as m from User", function (err, row) {
      if (err) throw err;
      lastID = row["m"];
    });
  });

  test("Standard user: output of insertUser", (done) => {
    const salt = Crypto.randomBytes(16);
    Crypto.pbkdf2(
      "password0",
      salt,
      310000,
      32,
      "sha256",
      function (err, hashedPassword) {
        insertUser(db, "username", hashedPassword, salt, (err, user) => {
          expect(user).toEqual({ user_id: lastID + 1, username: "username" });
          done();
        });
      }
    );
  });

  test("Standard user: username found in database", (done) => {
    const salt = Crypto.randomBytes(16);
    Crypto.pbkdf2(
      "password1",
      salt,
      310000,
      32,
      "sha256",
      function (err, hashedPassword) {
        insertUser(db, "username1", hashedPassword, salt, async () => {
          // lastID+1 doesn't work in this test for some reason
          db.get(
            `select username as u from User where username="username1"`,
            function (err, row) {
              if (err) throw err;
              expect(row["u"]).toEqual("username1");
              done();
            }
          );
        });
      }
    );
  });

  test("Standard user: salt found in database", (done) => {
    const salt = Crypto.randomBytes(16); // TODO: shouldn't be random, will fix later
    Crypto.pbkdf2(
      "password2",
      salt,
      310000,
      32,
      "sha256",
      function (err, hashedPassword) {
        insertUser(db, "username2", hashedPassword, salt, () => {
          db.get(
            `select salt as s from User where username="username2"`,
            function (err, row) {
              if (err) throw err;
              expect(row["s"]).toEqual(salt);
              done();
            }
          );
        });
      }
    );
  });

  afterEach(async () => {
    // delete id created in test
    await db.run(`delete from User where user_id=${lastID + 1}`);
  });
});

const noUNOrPass = "Errordafo: Username or password not set!";

describe("Test signup route", () => {
  // block console logging
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  }); 
  
  test("Error 400 - no username or password", async () => {
    const res = await request.post("/api/signup").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(noUNOrPass);
  });

  test("Error 400 - no password", async () => {
    const res = await request.post("/api/signup").send({
      username: "username",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(noUNOrPass);
  });

  test("Error 400 - no username", async () => {
    const res = await request.post("/api/signup").send({
      password: "password",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(noUNOrPass);
  });

  test("Error 400 - bad username", async () => {
    const res = await request.post("/api/signup").send({
      username: "un$",
      password: "Very1Epic!",
    });
    expect(res.statusCode).toEqual(400);
  });

  test("Error 400 - bad password", async () => {
    const res = await request.post("/api/signup").send({
      username: "usernameVeryEpic",
      password: "password",
    });
    expect(res.statusCode).toEqual(400);
  });
  
  test("Error 400 - username already exists", async () => {
    await request.post("/api/signup").send({
        username: "usernameVeryCool1",
        password: "Very1Epic",
    });

    const res = await request.post("/api/signup").send({
        username: "usernameVeryCool1",
        password: "Very1Epic",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual("Error: Username already exists!");
  });

  test("Response 200 - happy insertion", (done) => {
    // this test *may* look a little gross, but this makes sure it hits all the lines of the test
    request
      .post("/api/signup")
      .send({
        username: "usernameVeryEpic",
        password: "Very1Epic",
      })
      .then((res) => {
        expect(res.statusCode).toEqual(200);

        db.get(
          `select user_id from User where username="usernameVeryEpic"`,
          function (err, row) {
            if (err) throw err;
            expect(row["user_id"]).toBeDefined(); // we don't know the user_id; however, it should be something
            done();
          }
        );
      });
  });

  // nuke the table afterwards
  afterEach(async () => {
    await db.run("DELETE FROM User");
  })
});