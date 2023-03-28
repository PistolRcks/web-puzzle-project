const Express = require('express')
const path = require('path')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv')
dotenv.config()

const dataRouter = require('./api/api.js')
const { redirectBundleManifest, logRouteAndCheckAuthorization } = require("./middleware");

const app = new Express()
const oneHour = 1000 * 60 * 60;

// Parse JSON boides into JavaScript objects
app.use(Express.json())

// Cookie parser middleware
app.use(cookieParser())

// Session will automatically terminate after the `maxAge` specified in the cookie.
app.use(session({
  secret: process.env.SESSION_SECRET ?? 'testEnv',
  saveUninitialized: true,
  cookie: { maxAge: 4 * oneHour },
  resave: false
}))

app.use(redirectBundleManifest)

app.use(logRouteAndCheckAuthorization)

app.use(Express.static('public'))

app.use('/api', dataRouter)

app.get(['/Puzzle/Selection', '/Puzzle/1' ], (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

module.exports = app
