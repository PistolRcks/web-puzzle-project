const Crypto = require("crypto");
const { db } = require("../db");

function login(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Error: Username or password not set!");
    return;
  }

  // Verify password correctness
  verifyPassword(db, username, password, (status, reason, user) => {
    // Password correctly verified, store info
    if (status === 200) {
      // Store the userID and username for use on the front and back end
      req.session.userID = user.userID;
      req.session.username = username;
      req.session.pfpSeed = user.pfpSeed;
      req.session.pfpBackgroundColor = user.pfpBackgroundColor;
      if (req.session.promptUser && req.session.oauthID) {
        // Delete oauth row
        deleteOauth(db, req.session.oauthID, (status, reason) => {
          if (status === 200) {
            // Update username row with oauthID
            updateUserOauth(db, req.session.oauthID, req.session.userID, (status, reason) => {
              req.session.promptUser = false;
              res.status(status).send(reason);
            })
            return;
          }
          res.status(status).send(reason);
        })
        return;
      }
    }
    // whether we verified or not, send out what happened
    res.status(status).send(reason);
  });
}

/**
 * Verifies that a password is correct by checking the attempted password with the stored one for that User.
 * @param {Database} db - The SQLite3 database to search in.
 * @param {String} username - The username of the User which owns the password.
 * @param {String} password - The attempted password to be verified.
 * @param {Function} callback - Called after completion of the function. Takes in three parameters:
 *  - `Number` status - The status code of the result of verifying the password.
 *  - `String` reason - The textual reason of the result of verifying the password.
 *  - `Number|undefined` userID - The userID of the user being verified. Will be `null` if the password is not verified.
 */
function verifyPassword(db, username, password, callback) {
  // select existing user in database
  db.get(
    "SELECT hashed_password, salt, user_id, default_pfp_seed, default_pfp_color FROM User WHERE username = ?",
    username,
    function (err, row) {
      // if entered username isn't found, send error
      if (err) {
        callback(500, err, null);
        return;
      }

      if (!row) {
        callback(500, "Error: Username not found!", null);
        return;
      }

      const { hashed_password: hashedPassword, 
              user_id: userID,
              salt,
              default_pfp_seed: pfpSeed,
              default_pfp_color: pfpBackgroundColor } = row;

      // if entered username is found, encrypt entered password with existing salt
      Crypto.pbkdf2(
        password,
        salt,
        310000,
        32,
        "sha256",
        function (err, attemptedPassword) {
          // if an error was made upon doing this, send an error
          if (err) {
            callback(500, err, null);
            return;
          }
          // if the attempted password matches the existing password, let user know login
          // was a success, otherwise send an error
          if (Buffer.compare(attemptedPassword, hashedPassword) === 0) {
            callback(200, "OK", { userID, pfpSeed, pfpBackgroundColor});
          } else {
            callback(401, "Invalid password.", null);
          }
        }
      );
    }
  );
}

function deleteOauth(db, oauthID, callback) {
  // select existing user in database
  db.get(
    "DELETE FROM User WHERE oauth_id = ?",
    oauthID,
    function (err, row) {
      if (err) {
        callback(500, err);
        return;
      }
      callback(200, "OK");
    }
  );
}

function updateUserOauth(db, oauthID, userID, callback) {
  // select existing user in database
  db.get(
    "UPDATE User SET oauth_id = ? WHERE user_id = ?",
    oauthID,
    userID,
    function (err, row) {
      if (err) {
        callback(500, err);
        return;
      }
      callback(200, "OK");
    }
  );
}

module.exports = { login, verifyPassword };
