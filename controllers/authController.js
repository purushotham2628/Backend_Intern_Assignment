import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { ROLES, ERROR_MESSAGES } from "../utils/constants.js"

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" })
}

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] })
    if (user) {
      return res.status(400).json({
        success: false,
        message: user.email === email ? ERROR_MESSAGES.EMAIL_EXISTS : ERROR_MESSAGES.USERNAME_EXISTS,
      })
    }

    // Create new user
    user = new User({
      email,
      password,
      username,
      role: ROLES.USER,
    })

    await user.save()
    const token = generateToken(user._id, user.role)

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

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

    const token = generateToken(user._id, user.role)

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}
