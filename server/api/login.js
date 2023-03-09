const Crypto = require("crypto");
const { db } = require("../db");

function login(req, res, next) {
  if (!req.body.password || !req.body.username) {
    res.status(400).send("Error: Username or password not set!");
    return;
  }

  const { username, password } = req.body;

  // select existing user in database
  db.get(
    "SELECT hashed_password, salt, user_id FROM User WHERE username = ?",
    username,
    function (err, row) {
      // if entered username isn't found, send error
      if (err) {
        // TODO: Eventually place more speciic errors in here
        return res.status(500).send(err);
      }

      if (!row) {
        res.status(500).send("Error: Username not found!");
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
            // TODO: send specific errors eventually
            return res.status(500).send(err);
          }
          // if the attempted password matches the existing password, let user know login
          // was a success, otherwise send an error
          if (Buffer.compare(attemptedPassword, hashedPassword) === 0) {
            // Store the userID and username for use on the front and back end
            req.session.userID = userID;
            req.session.username = username;

            // TODO (fixme): We're currently sending no text! It crashes tests for no fucking reason!!!
            // TODO (fixme): If you can figure it out, be my guest!!! Otherwise, status 200 should be enough to say you're ok
            res.status(200).send(';ok');
          } else {
            res.status(401).send(err);
          }
        }
      );
    }
  );
}

module.exports = { login };
