import express from "express"
import { authenticate } from "../middleware/auth.js"
import { isAdminOrOwner, isOwner } from "../middleware/authorization.js"
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserFollowers,
  getUserFollowing,
  makeAdmin,
  removeAdmin,
} from "../controllers/userController.js"
import { validateUpdate, validate } from "../utils/validation.js"

const router = express.Router()

router.get("/", authenticate, getAllUsers)
router.get("/:id", authenticate, getUserById)
router.put("/:id", authenticate, validateUpdate, validate, updateUser)
router.delete("/:id", authenticate, isAdminOrOwner, deleteUser)
router.get("/:id/followers", authenticate, getUserFollowers)
router.get("/:id/following", authenticate, getUserFollowing)
router.post("/admin/make", authenticate, isOwner, makeAdmin)
router.post("/admin/remove", authenticate, isOwner, removeAdmin)

export default router
