const Express = require('express')
const signup = require(`./signup`).signup

const router = new Express.Router()
router.use(Express.urlencoded({ extended: true }))
router.use(Express.json())

router.get('/testRoute', (req, res) => {
  res.send('success')
})

router.post('/signup', signup)

module.exports = router