import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { ROLES, ERROR_MESSAGES } from "../utils/constants.js"
import { validateSignupInput, validateLoginInput } from "../utils/validation.js"

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" })
}

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body

    // Validate input
    const validationErrors = validateSignupInput(email, password, username)
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? ERROR_MESSAGES.EMAIL_EXISTS : ERROR_MESSAGES.USERNAME_EXISTS,
      })
    }

    // Create new user
    const user = new User({
      email,
      password,
      username,
      role: ROLES.USER,
    })

    // Save user - this will trigger password hashing in pre-save hook
    await user.save()

    // Generate token
    const token = generateToken(user._id, user.role)

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("[SIGNUP_ERROR]", error.message)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    const validationErrors = validateLoginInput(email, password)
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      })
    }

    // Compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      })
    }

    // Generate token
    const token = generateToken(user._id, user.role)

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("[LOGIN_ERROR]", error.message)
    return res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
