const Express = require('express');
const Crypto = require('crypto');

// TODO (integration): change the link to where the database module will actually 
// live!
// var db = require('../db');

var router = new Express.Router();

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
      // TODO: eventually, this should be replaced with more sophisticated
      // error handling
      res.status(400).send("Username or password not set!")
    }

    var salt = Crypto.randomBytes(16);      // salt is required for hashing; it makes 
                                            // otherwise identical hashes different
    Crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      res.send([req.body.username, hashedPassword.toString('utf-8'), salt]);
      // insert new user into database
      // FIXME: Will remain stubbed until we get the database setup
      /*
      db.run('INSERT INTO users (username, hashed_pass, salt) VALUES (?, ?, ?)', [
        req.body.username,
        hashedPassword,
        salt
      ], function(err) {
        if (err) { return next(err); }
        var user = {
          id: this.lastID,
          username: req.body.username
        };
        // FIXME: I have no clue what this might be or if it would work
        // It's not in the express documentation...
        req.login(user, function(err) {
          if (err) { return next(err); }
          res.redirect('/');    // TODO: eventually this should lead to the puzzle select page
        });
      });
      */
    });
  };
  
  module.exports = signup;