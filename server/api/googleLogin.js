const { db } = require("../db");

async function googleLogin(req, res, next) {
  if (!req.body.googleIdToken) {
    res.status(400).send("Error: Google Id Not Set!");
    return;
  }
  const username = req.body.googleIdToken;
  // select existing user in database
  db.get(
    "SELECT username FROM User WHERE username = ?",
    username,
    async function (err, row) {
      // if entered username isn't found, send error
      if (err) {
        // TODO: Eventually place more speciic errors in here
        res.status(500).send(err);
        return;
      }

      if (!row) {
        // res.status(500).send("Error: Google User not found!");
        await googleSignup(username);
      }

      res.status(200).send();
    }
  );
}

async function googleSignup(username) {

  // check that signup data is real
  if (!username ) {
    res.status(400).send("Error: Username not set!");
    return;
  }
      // insert new user into database
      await insertUser(
        db,
        username,
        (err, user) => {
          if (err) {
            // 19 is SQLITE_CONSTRAINT, should be username constraint
            if (err.errno == 19) {
              res.status(400).send("Error: Username already exists!")
            } else { // idk how to test for this branch
              res
                .status(500)
                .send(`Error: Failed to insert new user!\nSpecific error: ${err}`);
            }
            return; // end prematurely
          }
          // TODO (integration): After correctly signing up, log the user in
          res.status(200).send(`Successfully signed user ${username} up!`);
        }
      )
}

async function insertUser(db, username, callback) {
  await db.run(
    "INSERT INTO User (username) VALUES (?)",
    [username],
    function (err) {
      var user = {};

      // throw an error if there's an issue
      if (err) {
        callback(err, user);
        return;
      }

      // create a user object, handle it elsewhere
      // TODO: Perhaps this should also generate a user token at this time?
      user = {
        user_id: this.lastID,
        username: username,
      };

      callback(err, user);
    }
  );
}

module.exports = { googleLogin };
