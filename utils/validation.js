import { body, validationResult } from "express-validator"

export const validateSignup = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("username").isLength({ min: 3 }).trim().withMessage("Username must be at least 3 characters"),
]

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
]

export const validatePost = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Post content is required")
    .isLength({ max: 5000 })
    .withMessage("Post content cannot exceed 5000 characters"),
]

export const validateUpdate = [
  body("username").optional().trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("bio").optional().trim().isLength({ max: 500 }).withMessage("Bio cannot exceed 500 characters"),
]

export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    })
  }
  next()
}
