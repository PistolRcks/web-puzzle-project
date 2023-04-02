import { insertUser } from "../../server/api/googleLogin";
import { db } from "../../server/db";
import * as Crypto from "crypto";
import Supertest from "supertest";

const App = require("../../server/index");
const request = Supertest(App);

jest.mock("../../server/db");

describe("Test insertUser", () => {
  var lastID = -1;

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });
  });

  beforeEach(async () => {
    // get the last user user_id
    await db.get("select max(user_id) as m from User", function (err, row) {
      if (err) throw err;
      lastID = row["m"];
    });
  });

  test("Standard user: output of insertUser", (done) => {
    insertUser(db, "username", (err, user) => {
      expect(user).toEqual({ user_id: lastID + 1, username: "username" });
      done();
    });
  });

  test("Standard user: username found in database", (done) => {
    insertUser(db, "username1", async () => {
      db.get(
        `select username as u from User where username="username1"`,
        function (err, row) {
          if (err) throw err;
          expect(row["u"]).toEqual("username1");
          done();
        }
      );
    });
  });

  afterEach(async () => {
    // delete id created in test
    await db.run(`delete from User where user_id=${lastID + 1}`);
  });
});

const noGoogleID = "Error: Google Id Not Set!";

describe("Test googleLogin route", () => {
  // block console logging
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });
  });

  test("Error 400 - no username", async () => {
    const res = await request.post("/api/googleLogin").send({
    });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual(noGoogleID);
  });

  test("Response 200 - If username exists use it", async () => {
    await request.post("/api/googleLogin").send({
      googleIdToken: "usernameVeryCool1",
    });

    const res = await request.post("/api/googleLogin").send({
      googleIdToken: "usernameVeryCool1",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("");
  });

  test("Response 200 - happy insertion", (done) => {
    // this test *may* look a little gross, but this makes sure it hits all the lines of the test
    request
      .post("/api/googleLogin")
      .send({
        googleIdToken: "usernameVeryEpic",
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