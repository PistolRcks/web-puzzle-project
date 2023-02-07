const Express = require('express')

const router = new Express.Router()
router.use(Express.urlencoded({ extended: true }))
router.use(Express.json())

router.get('/testRoute', (req, res) => {
  res.send('success')
})

module.exports = router