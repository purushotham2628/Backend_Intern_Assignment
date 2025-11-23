import express from "express"
import { authenticate } from "../middleware/auth.js"
import { createPost, getAllPosts, getPostById, updatePost, deletePost } from "../controllers/postController.js"
import { validatePost, validate } from "../utils/validation.js"

const router = express.Router()

router.post("/", authenticate, validatePost, validate, createPost)
router.get("/", authenticate, getAllPosts)
router.get("/:id", authenticate, getPostById)
router.put("/:id", authenticate, validatePost, validate, updatePost)
router.delete("/:id", authenticate, deletePost)

export default router
