import jwt from "jsonwebtoken"
import { ERROR_MESSAGES } from "../utils/constants.js"

export const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
  // don't call next() here unconditionally — response has already been sent on error
}
