const Crypto = require("crypto");

const {
  checkUsernameServer,
  checkPasswordServer,
} = require("../../utilities/AccountValidators");
const { db } = require("../db");
const { login } = require("./login");

/**
 * The callback function for the /api/signup POST route. Signs up a user into the database.
 *
 * The `req` parameter should contain both `username` and `password` in its body.
 * @param {Express.Request} req - The Request object generated by the route.
 * @param {Express.Response} res - The Response object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns Nothing.
 */
function signup(req, res, next) {
  const { username, password } = req.body;

  // check that signup data is real
  if (!username || !password) {
    res.status(400).send("Error: Username or password not set!");
    return;
  }

  // test username and password; should throw an error if there's an issue
  try {
    checkUsernameServer(username);
    checkPasswordServer(password);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }
  
  // salt is required for hashing; it makes
  // otherwise identical hashes different
  const salt = Crypto.randomBytes(16); 
  Crypto.pbkdf2(
    password,
    salt,
    310000,
    32,
    "sha256",
    async (err, hashedPassword) => {
      if (err) {
        return res.status(500).send(err);
      }
      
      // insert new user into database
      await insertUser(
        db,
        username,
        hashedPassword,
        salt,
        (err) => {
          if (err) {
            // 19 is SQLITE_CONSTRAINT, should be username constraint
            if (err.errno === 19) {
              res.status(400).send("Error: Username already exists!")
            } else {
              res
                .status(500)
                .send(`Error: Failed to insert new user!\nSpecific error: ${err}`);
            }
            return; // end prematurely
          }
          // Log the user in
          login(req, res, next);
        }
      )
    }
  );
}

/**
 * Inserts a new User into the database `db`. Calls a callback on the new user object afterwards.
 * @param {Database} db - The database to insert the User into.
 * @param {String} username - The username of the new User.
 * @param {Buffer} hashedPassword - The hashed password of the new User.
 * @param {String} salt - The salt used in hashing the password.
 * @param {Callback} callback - A callback which handles what happens after inserting the user.
 *                   Should take in one argument: an error `error`.
 *                   `error` will be null if there is no error.
 * @returns Nothing.
 */
async function insertUser(db, username, hashedPassword, salt, callback) {
  // Generate a random seed for the user's default pfp
  const diceBearSeed = Math.floor(Math.random() * 100000) + 1;
  // Generate a random background color for the user's default pfp
  const diceBearBackgroundColor = Math.floor(Math.random()*16777215).toString(16);

  await db.run(
    `INSERT INTO User 
      (username, hashed_password, salt, default_pfp_seed, default_pfp_color) 
      VALUES (?, ?, ?, ?, ?)`,
    [username, hashedPassword, salt, diceBearSeed, diceBearBackgroundColor],
    (err) => {
      if (err) {
        callback(err);
        return;
      }

      callback(err);
    }
  );
}

module.exports = { signup };
