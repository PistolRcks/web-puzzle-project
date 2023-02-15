const Express = require('express')
const path = require('path')
const dataRouter = require('./api/api.js')

const app = new Express()

// Parse JSON boides into JavaScript objects
app.use(Express.json())

app.use((req, res, next) => {
  console.log(`${req.method} at ${req.path}`)
  next()
})

app.use(Express.static('public'))

app.use('/api', dataRouter)

app.get(['/login', '/Puzzle/Selection', 'Puzzle/Details/:id' ], (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

module.exports = app
