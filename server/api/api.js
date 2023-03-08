const Express = require("express");
const { signup } = require("./signup");
const { randomWord } = require("./randomWord");
const { listPuzzles } = require("./listPuzzles");

const router = new Express.Router();
router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

router.get("/testRoute", (req, res) => {
  res.send("success");
});

router.post("/signup", signup);

router.get("/word", randomWord);

router.get("/listPuzzles", listPuzzles);

module.exports = router;
