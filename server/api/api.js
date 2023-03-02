const Express = require("express");
const { signup } = require("./signup");
const { randomWord } = require("./randomWord")

const router = new Express.Router();
router.use(Express.urlencoded({ extended: true }));
router.use(Express.json());

router.get("/testRoute", (req, res) => {
  res.send("success");
});

router.post("/signup", signup);

router.post("/word", randomWord);

module.exports = router;
