/**
 * The callback function for the authorized /api/logout POST route. Logs out a user.
 *
 * Under the hood, this calls req.session.destroy().
 * @param {Express.Request} req - The Request object generated by the route.
 * @param {Express.Response} res - The Response object generated by the route.
 * @param {Function} next - The next() function used in the callback.
 * @returns Nothing.
 */
function logout(req, res, next) {
  // Session should already exist due to this being an authorized route
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    res.status(200).send("Logged out.");
  });
}

module.exports = { logout };