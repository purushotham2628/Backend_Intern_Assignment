import express from "express"
import { authenticate } from "../middleware/auth.js"
import { getActivityFeed, getUserActivities } from "../controllers/activityController.js"

const router = express.Router()

router.get("/", authenticate, getActivityFeed)
router.get("/user/:userId", authenticate, getUserActivities)

export default router
