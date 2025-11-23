import express from "express"
import { authenticate } from "../middleware/auth.js"
import { isAdminOrOwner } from "../middleware/authorization.js"
import { likePost, unlikePost, getPostLikes, deleteLike } from "../controllers/likeController.js"

const router = express.Router()

router.post("/", authenticate, likePost)
router.delete("/admin/:likeId", authenticate, isAdminOrOwner, deleteLike)
router.delete("/:postId", authenticate, unlikePost)
router.get("/:postId", authenticate, getPostLikes)

export default router
