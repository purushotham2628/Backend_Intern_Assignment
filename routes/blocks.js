import express from "express"
import { authenticate } from "../middleware/auth.js"
import { blockUser, unblockUser, getBlockedUsers } from "../controllers/blockController.js"

const router = express.Router()

router.post("/", authenticate, blockUser)
router.delete("/:blockedId", authenticate, unblockUser)
router.get("/", authenticate, getBlockedUsers)

export default router
