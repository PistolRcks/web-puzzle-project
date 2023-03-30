const { db } = require("../db");


/**
 * The callback function for the /api/googleLogin POST route. Signs up a user into the database.
 *
 * The `req` parameter should contain `username` in its body.
 * @param {Express.Request} req - The Request object generated by the route.
 * @param {Express.Response} res - The Result object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns Nothing.
 */
async function googleLogin(req, res, next) {
  if (!req.body.googleIdToken) {
    res.status(400).send("Error: Google Id Not Set!");
    return;
  }
  const username = req.body.googleIdToken;
  // select existing user in database
  db.get(
    "SELECT user_id FROM User WHERE username = ?",
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
        await googleSignup(req, res, username);
        return;
      }
      // console.log(row);
      // console.log(userID);
      const { user_id: userID } = row;
      req.session.userID = userID;
      req.session.username = username;
      res.status(200).send();
    }
  );
}

async function googleSignup(req, res, username) {
  if (!username ) {
    res.status(400).send("Error: Username not set!");
    return;
  }
      await insertUser(
        db,
        username,
        (err, user) => {
          if (err) {
            if (err.errno == 19) {
              res.status(400).send("Error: Username already exists!")
            } else {
              res
                .status(500)
                .send(`Error: Failed to insert new user!\nSpecific error: ${err}`);
            }
            return;
          }
          req.session.userID = user.user_id;
          req.session.username = user.username;
          res.status(200).send(`Successfully signed user ${username} up!`);
        }
      )
}


/**
 * Inserts a new User into the database `db`. Calls a callback on the new user object afterwards.
 * @param {Database} db - The database to insert the User into.
 * @param {String} username - The username of the new User.
 * @param {Callback} callback - A callback which handles what happens after inserting the user.
 *                   Should take in two arguments: an error `error` and the `user` object generated from `insertUser`.
 *                   `user` will be an empty object if an error is thrown, and `error` will be null if there is no error.
 * @returns Nothing.
 */
async function insertUser(db, username, callback) {
  await db.run(
    "INSERT INTO User (username) VALUES (?)",
    [username],
    function (err) {
      let user = {};

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

module.exports = { googleLogin, insertUser };
