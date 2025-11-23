import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/database.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import likeRoutes from "./routes/likes.js"
import followRoutes from "./routes/follows.js"
import blockRoutes from "./routes/blocks.js"
import activityRoutes from "./routes/activities.js"
import { errorHandler } from "./middleware/errorHandler.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database Connection
connectDB()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/follows", followRoutes)
app.use("/api/blocks", blockRoutes)
app.use("/api/activities", activityRoutes)

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running", timestamp: new Date() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})
