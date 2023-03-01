const {
  checkUsernameRequirements,
  checkPasswordRequirements,
} = require("../../utilities/AccountValidators");
const { db } = require("../db");
const Crypto = require("crypto");

/**
 * The callback function for the /api/signup POST route. Signs up a user into the database.
 *
 * The `res` parameter should contain both `username` and `password` in its body.
 * @param {Express.Request} req - The Request object generated by the route.
 * @param {Express.Response} res - The Result object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns Nothing.
 */
function signup(req, res, next) {
  // check that signup data is real
  if (!req.body.username || !req.body.password) {
    res.status(400).send("Error: Username or password not set!");
    return;
  }

  // test username and password; should throw an error if there's an issue
  try {
    checkUsernameRequirements(req.body.username);
    checkPasswordRequirements(req.body.password);
  } catch (error) {
    res.status(401).send(error.message);
    return;
  }

  const salt = Crypto.randomBytes(16); // salt is required for hashing; it makes
  // otherwise identical hashes different
  Crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    32,
    "sha256",
    async function (err, hashedPassword) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      // insert new user into database
      try {
        const newUser = await insertUser(
          db,
          req.body.username,
          hashedPassword,
          salt,
          (user) => {
            res
              .status(200)
              .send(`Successfully signed user ${req.body.username} up!`);
          }
        );
        // TODO (integration): After correctly signing up, log the user in
      } catch (err) {
        res
          .status(500)
          .send(`Error: Failed to insert new user!\nSpecific error: ${err}`);
        return;
      }
    }
  );
}

/**
 * Inserts a new User into the database `db`. Calls a callback on the new user object afterwards.
 * @param {Database} db - The database to insert the User into.
 * @param {String} username - The username of the new User.
 * @param {Buffer} hashedPassword - The hashed password of the new User. This (hopefully) should be generated by `Crypto.pbkdf2()`.
 * @param {String} salt - The salt used in hashing the password.
 * @param {Callback} callback - A callback which handles what happens after inserting the user.
 *                   Should take in one argument: the `user` object generated from `insertUser`.
 * @returns Nothing.
 */
async function insertUser(db, username, hashedPassword, salt, callback) {
  await db.run(
    "INSERT INTO User (username, hashed_password, salt) VALUES (?, ?, ?)",
    [username, hashedPassword, salt],
    function (err) {
      // throw an error if there's an issue
      if (err) throw err;

      // create a user object, handle it elsewhere
      // TODO: Perhaps this should also generate a user token at this time?
      var user = {
        user_id: this.lastID,
        username: username,
      };

      // let error propagate, it's fine
      callback(user);
    }
  );
}

module.exports = { signup, insertUser };
