const Express = require("express");
const { signup } = require("./signup");
const { login } = require("./login");
const { logout } = require("./logout")
const { randomWord } = require("./randomWord");
const { listPuzzles } = require("./listPuzzles");
const { setUserPuzzleMeta } = require("./setUserPuzzleMeta");
const { googleLogin } = require("./googleLogin");
const { getUserInfo, postUserInfo } = require("./userInfo")

const router = new Express.Router();

// Parse the incoming data
router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

router.get("/verify", (req, res) => {
  res.status(200).send("Authorized");
});

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/word", randomWord);

router.get("/listPuzzles", listPuzzles);

router.post("/userPuzzleMeta", setUserPuzzleMeta);

// User profile routes
router.get("/user/:user_id(\\d+)", getUserInfo);  // user_id must be one or more digits
router.post("/user", postUserInfo)                // always affects the current user; `:user_id` unnecessary

router.post("/googleLogin", googleLogin);

module.exports = router;

