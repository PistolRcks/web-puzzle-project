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
        // place row data into the output
        out = { ...row };

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

            // only insert the data we've got if we have it
            out.best_times = rows ? rows : [];

            // finally have all our data; send it
            res.status(200).json(out);
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
 * The callback function for the /api/user/password POST route. Updates a User's password.
 *
 * This endpoint requires authorization.
 * This function validates and then updates the password.
 * The salt is changed when the password is updated.
 * @param {Express.Request} req - The Request object generated by the route
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
function setUserPassword(req, res, next) {
  if (!("old_password" in req.body && "new_password" in req.body)) {
    res
      .status(400)
      .send(
        "Error: Either 'old_password' or 'new_password' (or both) not found in the request body!"
      );
    return;
  }

  const { old_password, new_password } = req.body;

  // validate new password requirements
  try {
    checkPasswordServer(new_password);
  } catch (e) {
    res.status(400).send(e.message);
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

                // Going to assume that an error will be thrown if the password
                // was not successfully updated. I honestly don't know a case where
                // an error would not be thrown, yet it was not successfully updated.
                // Also, the testing for adding the "this" sucks and I don't wanna anymore
                res.status(200).send("Successfully updated password!");
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

/**
 * The callback function for the /api/user/picture POST route. Updates a User's profile picture.
 *
 * This endpoint requires authorization.
 * @param {Express.Request} req - The Request object generated by the route
 *  The request body should be formatted as JSON with the following:
 *  ```js
 *  {
 *    "profile_picture": "A string-encoded binary blob of the image being uploaded",
 *    "profile_picture_top": the integer cropping point from the top of the image,
 *    "profile_picture_left": the integer cropping point from the left of the image,
 *  }
 *  ```
 * @param {Express.Response} res - The Response object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns Nothing.
 */
function setUserPFP(req, res, next) {
  // Existence validation
  if (
    !(
      "profile_picture" in req.body &&
      "profile_picture_top" in req.body &&
      "profile_picture_left" in req.body
    )
  ) {
    res
      .status(400)
      .send(
        "Error: 'profile_picture', 'profile_picture_top', or 'profile_picture_left' not found in the request body!"
      );
    return;
  }
  
  // Type validation
  const { profile_picture, profile_picture_top, profile_picture_left } = req.body
  
  if (isNaN(profile_picture_top) || isNaN(profile_picture_left)) {
    res.status(400).send("Error: 'profile_picture_top' or 'profile_picture_left' is not a number!")
  }
  
  // Space validation
  // TODO: Maybe we should figure out how we could make sure the cropping is not greater than the size of the image?
  if (profile_picture_top < 0 || profile_picture_left < 0) {
    res.status(400).send("Error: 'profile_picture_top' or 'profile_picture_left' is negative!")
  }

  // Input data now
  db.run("UPDATE User SET profile_picture = ?, profile_picture_top = ?, profile_picture_left = ? WHERE user_id = ?",
    [profile_picture, profile_picture_top, profile_picture_left, req.session.userID],
    function(err) {
      if (err) {
        res.status(500).send(err);
        return;
      }
      
      res.status(200).send("Profile picture updated successfully.")
    })
}

module.exports = {
  getUserInfo,
  setUserPassword,
  setUserPFP,
};
