const { db } = require("../db");

/**
 * The callback function for the /api/listPuzzles GET route.
 *
 * The `res` parameter should return an array of JSON objects containing puzzle data.
 * @param {Express.Request} req - The Request object generated by the route.
 * @param {Express.Response} res - The Result object generated by the route.
 * @returns Nothing.
 */
function listPuzzles(req, res) {
  const { userID, username, pfpSeed, pfpBackgroundColor } = req.session;

  //up.progress, p.puzzle_id, p.title, p.description

  const puzzleListQuery = `
      SELECT *
      FROM Puzzle
      ORDER BY puzzle_id
    `;

  const userPuzzleCompletionQuery = `
    SELECT progress, puzzle_id 
    FROM User_Puzzle
    WHERE user_id = ${userID}
    ORDER BY puzzle_id
    `;

  db.all(puzzleListQuery, (err, rows) => {
    if (err) {
      res.status(500).send(err);
    } else {
      db.all(userPuzzleCompletionQuery, (err, userPuzzleCompletion) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).send({
            userID,
            username,
            pfpSeed,
            pfpBackgroundColor,
            puzzles: rows,
            userPuzzleCompletion
          });
        }
      });
    }
  });
}

module.exports = { listPuzzles };
