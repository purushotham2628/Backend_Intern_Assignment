import { ROLES, ERROR_MESSAGES } from "../utils/constants.js"

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.UNAUTHORIZED,
      })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      })
    }

    next()
  }
}

export const isOwner = (req, res, next) => {
  if (req.user.role !== ROLES.OWNER) {
    return res.status(403).json({
      success: false,
      message: ERROR_MESSAGES.FORBIDDEN,
    })
  }
  next()
}

export const isAdminOrOwner = (req, res, next) => {
  if (![ROLES.ADMIN, ROLES.OWNER].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: ERROR_MESSAGES.FORBIDDEN,
    })
  }
  next()
}
