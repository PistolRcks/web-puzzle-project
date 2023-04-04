const dotenv = require('dotenv')
const https = require('https');
const fs = require('fs');
dotenv.config()

const app = require('./index.js')
const PORT = process.env.PORT

https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )
  .listen(3000, () => {
    console.log((`https://localhost:${PORT}\nListening on port: ${PORT}`));
  });