// Provides routes to get and set user info for the user profile page
const { db } = require("../db");

/**
 * The callback function for the /api/user/:user_id GET route. Gets a User's information.
 *
 * For security (and safety), this endpoint requires authorization.
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
 *  If an error occurs, only the key "error" will be sent with an error message.
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
        res.status(500).json({error: String(err)});
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
              res.status(500).json({error: String(err)});
              return;
            }
           
            if (rows) {
              for (const puzzle of rows) {
                out.best_times.push(puzzle)
              }
              
              // finally have all our data; send it
              res.status(200).json(out);
            } else {
              // User has no completed puzzles
              // I think 406 fits the best description
              res.status(406).json({error: `User with ID ${userID} has no completed puzzles.`})
            }
          }
        );
      } else {
        // There isn't a User with that ID
        res.status(400).json({error: `User with ID ${userID} does not exist.`})
      }
    }
  );
}

/**
 * The callback function for the /api/user POST route. Updates a User's information.
 *
 * This endpoint requires authorization.
 * Currently, this function only validates and then updates the password.
 * @param {Express.Request} req - The Request object generated by the route. 
 *  The request should be formatted as JSON with the following:
 *  ```js
 *  {
 *    "old_password": "the string of the old password "
 *    "password": "the string of the new password to use"
 *  }
 *  ```
 * @param {Express.Response} res - The Response object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns Nothing.
 */
function postUserInfo(req, res, next) {
  /*
    The endpoint validates the a user is logged in.
    The endpoint validates the password only contains allowed characters.
    The endpoint successfully updates the user’s password to the new one.
    The endpoint sends error responses in the event of an error occurring, input failing validation, user not being logged in, etc.
  */
  
  
}

module.exports = {
  getUserInfo,
  postUserInfo,
};
