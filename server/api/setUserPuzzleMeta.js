// Other UserPuzzle relationship routes will be placed here.
// Eventually, the `time` metadata might be set here as well.
const { db } = require("../db");

/**
 * The callback function for the /api/userPuzzleMeta POST route.
 * Sets the value of the completion of a puzzle (i.e. User_Puzzle.progress).
 *
 * @param {Express.Request} req - The Request object generated by the route.
 *      Should contain the following keys:
 *          - `progress` {Number} - The decimal representation of the binary number defining the progress of the puzzle.
 *              For now, the number will be `0` for an incomplete puzzle and `1` for a complete puzzle.
 *          - `puzzle_id` {Number} - The `puzzle_id` value of the Puzzle with which to update the User_Puzzle relation.
 *          - `time` {Number} - The integer time (in milliseconds) in which the user finished the puzzle.
 * @param {Express.Response} res - The Response object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 */
function setUserPuzzleMeta(req, res, next) {
  // get the data we need; we should already be authorized so there should already be a session
  const { userID } = req.session;
  const { progress, puzzle_id: puzzleID, time } = req.body;

  // safety net - check for required key existence
  if (
    !("progress" in req.body && "puzzle_id" in req.body && "time" in req.body)
  ) {
    res
      .status(400)
      .send(
        `Error: Malformed input - required key "progress", "puzzle_id", or "time" not found in request body.`
      );
    return;
  }

  // safety net - check for typing
  if (isNaN(progress) || isNaN(puzzleID) || isNaN(time)) {
    res
      .status(400)
      .send(
        `Error: Malformed input - key "progress", "puzzle_id", or "time" is not a Number.`
      );
    return;
  }

  // check that the specific User_Puzzle exists
  db.get(
    "SELECT * FROM User_Puzzle WHERE user_id = ? AND puzzle_id = ?",
    [userID, puzzleID],
    function (err, row) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (row) {
        // update the value in the database
        db.run(
          "UPDATE User_Puzzle SET progress = ?, time = ? WHERE user_id = ? AND puzzle_id = ?",
          [progress, time, userID, puzzleID],
          function (err) {
            // throw errors if there's an issue
            if (err) {
              res.status(500).send(err);
              return;
            }

            // if it's done then we're fine!
            res
              .status(200)
              .send(
                `User_Puzzle relation between user_id ${userID} and puzzle_id ${puzzleID} successfully updated.`
              );
          }
        );
      } else {
        // User_Puzzle does not exist; make User_Puzzle
        // but first check that the Puzzle we want to insert exists
        db.get(
          "SELECT * FROM Puzzle WHERE puzzle_id = ?",
          [puzzleID],
          function (err, row) {
            if (err) {
              res.status(500).send(err);
              return;
            }

            if (!row) {
              res
                .status(400)
                .send(
                  `Puzzle with "puzzle_id" ${puzzleID} does not exist. Not inserting.`
                );
            } else {
              // now, since the Puzzle exists, we can do this
              db.run(
                "INSERT INTO User_Puzzle VALUES (?, ?, ?, ?)",
                [userID, puzzleID, time, progress],
                function (err) {
                  if (err) {
                    res.status(500).send(err);
                    return;
                  }

                  // if it's done then we're fine!
                  res
                    .status(200)
                    .send(
                      `User_Puzzle relation between user_id ${userID} and puzzle_id ${puzzleID} successfully created.`
                    );
                }
              );
            }
          }
        );
      }
    }
  );
}

module.exports = { setUserPuzzleMeta };
