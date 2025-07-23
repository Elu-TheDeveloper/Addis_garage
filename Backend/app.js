const express = require('express')
const app = express()

require('dotenv').config()

const cors = require('cors')
// const xss = require('xss-clean') // ✅ added

// ❌ You can remove or comment this — it's not valid
// const sanitize = require('sanitize')

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}

// Apply middleware
app.use(cors(corsOptions))
app.use(express.json())
// app.use(xss()) // ✅ xss-clean middleware added here

// ❌ Remove or comment this — not valid
// app.use(sanitize.middleware)

const router = require('./routes')
app.use(router)

const port = process.env.PORT
app.listen(port, () => {
  console.log(`server running on port:${port}`)
})

module.exports={app}
