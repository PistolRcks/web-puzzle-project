const Express = require("express");
const { signup } = require("./signup");
const { login } = require("./login");
const { logout } = require("./logout")
const { randomWord } = require("./randomWord");
const { listPuzzles } = require("./listPuzzles");

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

router.get("/word", randomWord);

router.get("/listPuzzles", listPuzzles);

module.exports = router;

