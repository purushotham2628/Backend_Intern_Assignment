import express from "express"
import { signup, login } from "../controllers/authController.js"
import { validateSignup, validateLogin, validate } from "../utils/validation.js"

const router = express.Router()

router.post("/signup", validateSignup, validate, signup)
router.post("/login", validateLogin, validate, login)

export default router
