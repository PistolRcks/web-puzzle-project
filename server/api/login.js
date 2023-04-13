const Crypto = require("crypto");
const { db } = require("../db");

function login(req, res, next) {
  if (!req.body.password || !req.body.username) {
    res.status(400).send("Error: Username or password not set!");
    return;
  }

  const { username, password } = req.body;

  // Verify password correctness
  verifyPassword(db, username, password, (status, reason, userID) => {
    // Password correctly verified, store info
    if (status === 200) {
      // Store the userID and username for use on the front and back end
      req.session.userID = userID;
      req.session.username = username;
    } 
    
    // whether we verified or not, send out what happened 
    res.status(status).send(reason);
  })
}

/**
 * Verifies that a password is correct by checking the attempted password with the stored one for that user.
 * @param {Database} db - The SQLite3 database to search in.
 * @param {String} username - The username which owns the password.
 * @param {String} password - The attempted password to be verified.
 * @param {Function} callback - Called after completion of the function. Takes in three parameters:
 *  - `Number` status - The status code of the result of verifying the password.
 *  - `String` reason - The textual reason of the result of verifying the password.
 *  - `Number|undefined` userID - The userID of the user being verified. Will be `null` if the password is not verified.
 */
function verifyPassword(db, username, password, callback) {
  // select existing user in database
  db.get(
    "SELECT hashed_password, salt, user_id FROM User WHERE username = ?",
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

      const { hashed_password: hashedPassword, salt, user_id: userID } = row;

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
            callback(200, "OK", userID);
          } else {
            callback(401, "Invalid password.", null);
          }
        }
      );
    }
  );
}

module.exports = { login, verifyPassword };
