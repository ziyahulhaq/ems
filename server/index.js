const express = require("express")
const cors = require("cors")
const connectToDatabase = require("./db/db.js")
const authRouter = require("./routes/auth.js")

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth',authRouter)

const startServer = async () => {
  try {
    await connectToDatabase()
    const port = process.env.PORT 

    app.listen(port, () => {
      console.log(`running on port ${port}`)
    })
  } catch (error) {
    process.exit(1)
  }
}

startServer()
