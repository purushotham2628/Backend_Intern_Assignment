import express from "express"
import { signup, login } from "../controllers/authController.js"
import { validateSignup, validateLogin, validate } from "../utils/validation.js"

const router = express.Router()

router.post("/signup", validateSignup, validate, (req, res, next) => signup(req, res, next))
router.post("/login", validateLogin, validate, (req, res, next) => login(req, res, next))

export default router
