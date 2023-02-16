const Crypto = require('crypto');

var db = require('../db');

/* POST /signup
 *
 * This route creates a new user account.
 *
 * A desired `username` and `password` are submitted to this route via an HTML form. 
 * The password is hashed and then a new user record is inserted into the 
 * database.  If the record is successfully created, the user is logged in.
 * 
 * This was also shamelessly stolen from the passport tutorial.
 */
function signup(req, res, next) {
  // check that signup data is real
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Error: Username or password not set!");
    return next("Error: Username or password not set!");
  }

  var salt = Crypto.randomBytes(16);      // salt is required for hashing; it makes 
                                          // otherwise identical hashes different
  Crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) {
      res.status(500).send(err); 
      return next(err); 
    }

    // insert new user into database
    try {
      var newUser = insertUser(req.body.username, hashedPassword, salt);
      res.status(200).send(`Successfully signed user ${req.body.username} up!`)
      // TODO (integration): After correctly signing up, log the user in
    } catch (err) {
      res.status(500).send(`Error: Failed to insert new user!\nSpecific error: ${err}`);
    }
  });
};
 

function insertUser(username, hashedPassword, salt) {
  var user;
  db.run('INSERT INTO User (username, hashed_password, salt) VALUES (?, ?, ?)', [
    username,
    hashedPassword,
    salt
  ], function(err) {
    // throw an error if there's an issue
    if (err) {
      throw err; 
    }

    // return the new user from the callback
    user = {
      id: this.lastID,
      username: username
    };
  });
  return user;
}

module.exports = signup;