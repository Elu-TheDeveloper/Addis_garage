const express = require('express')
const app = express()

require('dotenv').config()

const cors = require('cors')


const corsOptions = {
  // origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}

// Apply middleware
app.use(cors(corsOptions))
app.use(express.json())




const router = require('./routes')
app.use(router)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`server running on port:${port}`)
})

module.exports={app}
