const path = require("path");

/**
 * This middleware functions allows us to redirect any api request to a file like bundle.js back to the original /bundle.js.
 * When we don't redirect these files back to their base route,
 * server side errors are thrown due to the server trying to find the /Puzzle/Selection/bundle.js route, etc. upon page refresh.
 * @param {Express.Request} req - an ExpressJS variable holding request data from an API call
 * @param {Express.Response} res - an ExpressJS variable holding response data for an API call.
 * @param {Function} next - the next function to execute.
 * @returns - a server redirect if the route is for a redirectFile
 */
const redirectBundleManifest = (req, res, next) => {
  const redirectFileNames = [
    "bundle.js",
    "bundle.css",
    "manifest.json",
    "puzzle-piece-icon.ico",
  ];

  redirectFileNames.forEach((fileName) => {
    if (req.path !== `/${fileName}` && req.path.includes(fileName)) {
      return res.redirect(`/${fileName}`);
    }
  });

  next();
};

/**
 * This function checks whether or not {req/path} is an excepted path.
 * - If it is, the function moves onto the next middleware.
 * - If it is not, then it checks if the request has a sessionID, which corresponds to the user having logged in.
 *   - If no sessionID is found on the request, then the user has not logged in, and the middleware returns a 401 status.
 * @param {Express.Request} req - an ExpressJS variable holding request data from an API call
 * @param {Express.Response} res - an ExpressJS variable holding response data for an API call.
 * @param {Function} next - the next function to execute.
 * @returns `res` with a 401 status along with the `index.html` file if no session token was found in `req` and the route requires one.
 */
const logRouteAndCheckAuthorization = (req, res, next) => {
  const exceptedRoutes = [
    "/api/login",
    "/api/signup",
    "/",
    "/bundle.css",
    "/bundle.js",
    "/manifest.json",
    "/puzzle-piece-icon.ico",
  ];

  console.log(`${req.method} at ${req.path}`);

  // !If the route is not for a favicon or the Landing Page and the user is not logged in, they are unauthorized
  // Note: For some reason, we have to check if the response has been sent. I'm assuming express-session also sends a 401 response,
  //       but this function essentially tells it which routes need a session token.
  if (
    !exceptedRoutes.includes(req.path) &&
    !req.session?.userID &&
    !res.headersSent
  ) {
    return res
      .status(401)
      .sendFile(path.join(__dirname, "../public", "index.html"));
  }

  next();
};

module.exports = {
  redirectBundleManifest,
  logRouteAndCheckAuthorization,
};
