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
  const username = req.body.googleIdToken;

  if (!username) {
    res.status(400).send("Error: Google Id Not Set!");
    return;
  }

  // select existing user in database
  db.get(
    "SELECT user_id, default_pfp_seed, default_pfp_color FROM User WHERE username = ?",
    username,
    async function (err, row) {
      // if entered username isn't found, send error
      if (err) {
        // TODO: Eventually place more speciic errors in here
        return res.status(500).send(err);
      }

      if (!row) {
        return await googleSignup(req, res, username);
      }
      
      const { user_id: userID, 
              default_pfp_seed: pfpSeed, 
              default_pfp_color: pfpBackgroundColor } = row;
              
      req.session.userID = userID;
      req.session.username = username;
      req.session.pfpSeed = pfpSeed;
      req.session.pfpBackgroundColor = pfpBackgroundColor;
      return res.status(200).send();
    }
  );
}

async function googleSignup(req, res, username) {
  await insertGoogleUser(
    db,
    username,
    (err, user) => {
      if (err) {
        return res.status(500)
          .send(`Error: Failed to insert new user!\nSpecific error: ${err}`);
      }

      req.session.userID = user.user_id;
      req.session.username = user.username;
      req.session.pfpSeed = user.pfpSeed;
      req.session.pfpBackgroundColor = user.pfpBackgroundColor;

      return res.status(200).send(`Successfully signed user ${username} up!`);
    }
  )
}


/**
 * Inserts a new User into the database `db`. Calls a callback on the new user object afterwards.
 * @param {Database} db - The database to insert the User into.
 * @param {String} username - The username of the new User.
 * @param {Callback} callback - A callback which handles what happens after inserting the user.
 *                   Should take in one argument: an error `error`
 *                   `error` will be null if there is no error.
 * @returns Nothing.
 */
async function insertGoogleUser(db, username, callback) {
  // Generate a random seed for the user's default pfp
  const diceBearSeed = Math.floor(Math.random() * 100000) + 1;
  // Generate a random background color for the user's default pfp
  const diceBearBackgroundColor = Math.floor(Math.random()*16777215).toString(16);

  await db.run(
    `INSERT INTO User 
    (username, default_pfp_seed, default_pfp_color) 
    VALUES (?, ?, ?)`,
    [username, diceBearSeed, diceBearBackgroundColor],
    function (err, row) {
      if (err) {
        return callback(err);
      }

      // create a user object, handle it elsewhere
      const user = {
        user_id: this ? this.lastID : row.lastID,
        username: username,
        pfpSeed: diceBearSeed,
        pfpBackgroundColor: diceBearBackgroundColor
      };

      return callback(err, user);
    }
  );
}

module.exports = { googleLogin };
