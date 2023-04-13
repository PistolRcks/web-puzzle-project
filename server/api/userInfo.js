// Provides routes to get and set user info for the user profile page
const Crypto = require("crypto");
const { checkPasswordServer } = require("../../utilities/AccountValidators");
const { db } = require("../db");
const { verifyPassword } = require("./login");

/**
 * The callback function for the /api/user/:user_id GET route. Gets a User's information.
 *
 * This endpoint requires authorization.
 * The `:user_id` param is the user_id of the User whose information you want.
 * (e.g. `/api/user/1` would get the information for the User with user_id of 1.)
 * @param {Express.Request} req - The Request object generated by the route.
 * @param {Express.Response} res - The Response object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns A JSON object in the Response object with the following structure:
 *  ```js
 *    {
 *      "username": "the user's username",
 *      "profile_picture": "a string-encoded binary blob of the profile picture",
 *      "profile_picture_top": the integer cropping point from the top of the image,
 *      "profile_picture_left": the integer cropping point from the left of the image,
 *      "best_times": [
 *        {
 *          "puzzle_id": the integer id of the puzzle,
 *          "title": "the title of the puzzle",
 *          "time": the integer representation of the time spent in milliseconds
 *        },
 *        ...
 *      ]
 *    }
 *  ```
 *  For now, `best_times` will return all times, not just the best times.
 *  `best_times` are sorted in ascending order.
 *  If an error occurs, only the key "error" will be sent, containing error message.
 */
function getUserInfo(req, res, next) {
  let out = {
    username: "",
    profile_picture: "",
    profile_picture_top: 0,
    profile_picture_left: 0,
    best_times: [],
  };

  const { user_id: userID } = req.params;

  // get User info
  db.get(
    "SELECT username, profile_picture, profile_picture_top, profile_picture_left FROM User WHERE user_id=?",
    [userID],
    function (err, row) {
      if (err) {
        res.status(500).json({ error: String(err) });
        return;
      }

      if (row) {
        // FIXME: there's probably a nicer way to do this lol
        out.username = row.username;
        out.profile_picture = row.profile_picture;
        out.profile_picture_top = Number(row.profile_picture_top);
        out.profile_picture_left = Number(row.profile_picture_left);

        // get User_Puzzle info (only completed puzzles)
        db.all(
          `SELECT puzzle_id, title, time 
            FROM User_Puzzle
            JOIN Puzzle USING(puzzle_id) 
            WHERE user_id=? AND progress!=0
            ORDER BY time ASC
          `,
          [userID],
          function (err, rows) {
            if (err) {
              res.status(500).json({ error: String(err) });
              return;
            }

            if (rows) {
              for (const puzzle of rows) {
                out.best_times.push(puzzle);
              }

              // finally have all our data; send it
              res.status(200).json(out);
            } else {
              // User has no completed puzzles
              // I think 406 fits the best description
              res.status(406).json({
                error: `User with ID ${userID} has no completed puzzles.`,
              });
            }
          }
        );
      } else {
        // There isn't a User with that ID
        res
          .status(400)
          .json({ error: `User with ID ${userID} does not exist.` });
      }
    }
  );
}

/**
 * The callback function for the /api/user POST route. Updates a User's information.
 *
 * This endpoint requires authorization.
 * Currently, this function only validates and then updates the password.
 * The salt is changed when the password is updated.
 * @param {Express.Request} req - The Request object generated by the route.
 *  The request body should be formatted as JSON with the following:
 *  ```js
 *  {
 *    "old_password": "the string of the old password currently being used"
 *    "new_password": "the string of the new password to use"
 *  }
 *  ```
 * @param {Express.Response} res - The Response object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns Nothing.
 */
function postUserInfo(req, res, next) {
  const { old_password, new_password } = req.body;

  // validate new password
  try {
    checkPasswordServer(new_password);
  } catch (e) {
    res.status(400).send(e);
    return;
  }

  // check that old password and stored password match
  verifyPassword(
    db,
    req.session.username,
    old_password,
    (status, reason, userID) => {
      // we gucci, keep going
      if (status === 200) {
        // rehash new password, including making new salt
        const salt = Crypto.randomBytes(16);
        Crypto.pbkdf2(
          new_password,
          salt,
          310000,
          32,
          "sha256",
          (err, hashedPassword) => {
            if (err) {
              res.status(500).send(err);
              return;
            }

            // update user with new hashed password and salt
            // (safer to set by user_id and possibly faster)
            db.run(
              "UPDATE User SET hashed_password = ?, salt = ? WHERE user_id = ?",
              [hashedPassword, salt, userID],
              function (err) {
                if (err) {
                  res.status(500).send(err);
                  return;
                }

                // "lastID" should be there if we were successful
                if ("lastID" in this) {
                  res.status(200).send("Successfully updated password!")
                } else {
                  // this is terrible and hopefully this should never happen (err should happen first)
                  res.status(500).send("Error: Password failed to update!")
                }
              }
            );
          }
        );
      } else {
        // password verification failed
        res.status(status).send(reason);
      }
    }
  );
}

module.exports = {
  getUserInfo,
  postUserInfo,
};
