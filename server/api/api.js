const Express = require("express");
const { signup } = require("./signup");
const { login } = require("./login");
const { randomWord } = require("./randomWord");
const { listPuzzles } = require("./listPuzzles");
const { googleLogin } = require("./googleLogin");

const router = new Express.Router();
router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

router.get("/testRoute", (req, res) => {
  res.send("success");
});

router.post("/signup", signup);

router.post("/login", login);

router.get("/word", randomWord);

router.get("/listPuzzles", listPuzzles);

router.post("/googleLogin", googleLogin);

module.exports = router;

