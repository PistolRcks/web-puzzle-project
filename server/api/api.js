const Express = require('express')
const signup = require(`./signup`)
//const getPuzzles = require('./listpuzzles')
const puzzles = require('./listpuzzles')

const router = new Express.Router()
router.use(Express.urlencoded({ extended: true }))
router.use(Express.json())

router.get('/testRoute', (req, res) => {
  res.send('success')
})

router.post('/signup', signup)

router.get('/PuzzleSelection', (req, res, next) => {
  try {
    res.json(puzzles.getPuzzles(req.query.page));
  }
  catch (err) {
    console.error(`Error while getting puzzles`, err.message);
    next(err);
  }
})

module.exports = router