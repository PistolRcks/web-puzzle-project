const Express = require('express');
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
    if (!req.body.password || !req.body.username) {
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
      db.run('INSERT INTO User (username, hashed_password, salt) VALUES (?, ?, ?)', [
        req.body.username,
        hashedPassword,
        salt
      ], function(err) {
        if (err) {
          // TODO: Send more descriptive errors
          res.status(500).send(err) 
          return next(err); 
        }
        var user = {
          id: this.lastID,
          username: req.body.username
        };
        // TODO: After correctly signing up, log the user in

        res.status(200).send(`Successfully signed user ${user.username} up!`)
      });
    });
  };
  
  module.exports = signup;