import { insertUser } from "../../server/api/signup";
import { db } from "../../server/db";
import * as Crypto from "crypto";

jest.mock("../../server/db");

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
        insertUser(db, "username", hashedPassword, salt, (user) => {
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
      async function (err, hashedPassword) {
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
