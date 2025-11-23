export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateSignupInput = (email, password, username) => {
  const errors = []

  if (!email || !validateEmail(email)) {
    errors.push("Invalid email address")
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters")
  }

  if (!username || username.length < 3) {
    errors.push("Username must be at least 3 characters")
  }

  return errors
}

export const validateLoginInput = (email, password) => {
  const errors = []

  if (!email || !validateEmail(email)) {
    errors.push("Invalid email address")
  }

  if (!password) {
    errors.push("Password is required")
  }

  return errors
}

export const validatePostContent = (content) => {
  const errors = []

  if (!content || content.trim().length === 0) {
    errors.push("Post content is required")
  }

  if (content && content.length > 5000) {
    errors.push("Post content cannot exceed 5000 characters")
  }

  return errors
}

export const validatePost = (req, res, next) => {
  const { content } = req.body
  const errors = validatePostContent(content)

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    })
  }

  next()
}

export const validateUpdateInput = (username, bio) => {
  const errors = []

  if (username && username.length < 3) {
    errors.push("Username must be at least 3 characters")
  }

  if (bio && bio.length > 500) {
    errors.push("Bio cannot exceed 500 characters")
  }

  return errors
}

export const validateUpdate = (req, res, next) => {
  const { username, bio } = req.body
  const errors = validateUpdateInput(username, bio)

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    })
  }

  next()
}
