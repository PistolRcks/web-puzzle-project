const dotenv = require('dotenv')
dotenv.config()

const app = require('./index.js')
const PORT = process.env.PORT | 3000
app.listen(PORT, () => console.log(`http://localhost:${PORT}\nListening on port: ${PORT}`))
