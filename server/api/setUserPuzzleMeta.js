// Other UserPuzzle relationship routes will be placed here.
// Eventually, the `time` metadata might be set here as well.
const { db } = require("../db");

/**
 * The callback function for the /api/userPuzzle/progress POST route.
 * Sets the value of the completion of a puzzle (i.e. UserPuzzle.progress).
 *
 * @param {Express.Request} req - The Request object generated by the route.
 *      Should contain the following keys:
 *          - `progress` - The decimal representation of the binary number defining the progress of the puzzle.
 *              For now, the number will be `0` for an incomplete puzzle and `1` for a complete puzzle.
 *          - `puzzle_id` - The `puzzle_id` value of the Puzzle with which to update the UserPuzzle relation.
 * @param {Express.Response} res - The Result object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 */
function setUserPuzzleProgress(req, res, next) {
  // safety net
  if (!("progress" in req.body && "puzzle_id" in req.body)) {
    res
      .status(400)
      .send(
        `Error: Malformed input - required key "progress" or "puzzle_id" not found in request body.`
      );
    return;
  }

  // get the data we need; we should already be authorized so there should already be a session
  const { progress, puzzle_id: puzzleID } = req.body;
  const { userID } = req.session;

  // update the value in the database
  db.run(
    "UPDATE UserPuzzle SET progress = ? WHERE user_id = ? AND puzzle_id = ?",
    [progress, userID, puzzleID],
    function (err) {
        // throw errors if there's an issue
        if (err) {
            res.status(500).send(err);
            return;
        }

        // if it's done then we're fine!
        res.status(200).send(`Completion between user ${userID} and puzzle ${puzzleID} successfully updated.`);
    }
  );
}

module.exports = { setUserPuzzleProgress };