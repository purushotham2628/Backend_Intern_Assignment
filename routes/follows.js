import express from "express"
import { authenticate } from "../middleware/auth.js"
import { followUser, unfollowUser, getFollowStatus } from "../controllers/followController.js"

const router = express.Router()

router.post("/", authenticate, followUser)
router.get("/status/:userId", authenticate, getFollowStatus)
router.delete("/:followingId", authenticate, unfollowUser)

export default router
