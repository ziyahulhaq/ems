const express = require("express")
const cors = require("cors")
const path = require("path")
const fs = require("fs")
const connectToDatabase = require("./db/db.js")
const authRouter = require("./routes/auth.js")
const departmentRouter = require("./routes/department.js")
const employeeRouter = require("./routes/employee.js")
const leaveRouter = require("./routes/leave.js")

const app = express()
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error("Not allowed by CORS"))
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.options(/^\/api\/.*/, cors(corsOptions))
app.use(express.json({ limit: "10mb" }))
app.use('/api/auth',authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/leave', leaveRouter)

const frontendDistPath = path.join(__dirname, "..", "frdend", "dist")
const frontendIndexPath = path.join(frontendDistPath, "index.html")

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendDistPath))

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(frontendIndexPath)
  })
}


const startServer = async () => {
  try {
    await connectToDatabase()
    const port = process.env.PORT || 3444

    app.listen(port, () => {
      console.log(`running on port ${port}`)
    })
  } catch (error) {
    console.error("Server startup failed:", error)
    process.exit(1)
  }
}

startServer()
