const Crypto = require("crypto");
const { db } = require("../db");

function login(req, res, next) {
  const { username, password } = req.body;

  if (!req.body.password || !req.body.username) {
    return res.status(400).send("Error: Username or password not set!");
  }

  // select existing user in database
  db.get(
    "SELECT hashed_password, salt, user_id, default_pfp_seed, default_pfp_color FROM User WHERE username = ?",
    username,
    function (err, row) {
      // if entered username isn't found, send error
      if (err) {
        // TODO: Eventually place more speciic errors in here
        return res.status(500).send(err);
      }

      if (!row) {
        return res.status(500).send("Error: Username not found!");
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
        (err, attemptedPassword) => {
          // if an error was made upon doing this, send an error
          if (err) {
            // TODO: send specific errors eventually
            return res.status(500).send(err);
          }
          // if the attempted password matches the existing password, let user know login
          // was a success, otherwise send an error
          if (Buffer.compare(attemptedPassword, hashedPassword) === 0) {
            // Store the userID and username for use on the front and back end
            req.session.userID = userID;
            req.session.username = username;
            req.session.pfpSeed = pfpSeed;
            req.session.pfpBackgroundColor = pfpBackgroundColor;

            return res.status(200).send("OK");
          } else {
            return res.status(401).send(err);
          }
        }
      );
    }
  );
}

module.exports = { login };
