export const ROLES = {
  USER: "User",
  ADMIN: "Admin",
  OWNER: "Owner",
}

export const ACTIVITY_TYPES = {
  CREATED_POST: "created_post",
  DELETED_POST: "deleted_post",
  LIKED_POST: "liked_post",
  UNLIKED_POST: "unliked_post",
  FOLLOWED_USER: "followed_user",
  UNFOLLOWED_USER: "unfollowed_user",
  BLOCKED_USER: "blocked_user",
  UNBLOCKED_USER: "unblocked_user",
  USER_DELETED: "user_deleted",
  MADE_ADMIN: "made_admin",
  REMOVED_ADMIN: "removed_admin",
}

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized. Please login.",
  FORBIDDEN: "Forbidden. You do not have permission to perform this action.",
  NOT_FOUND: "Resource not found.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_EXISTS: "Email already registered.",
  USERNAME_EXISTS: "Username already taken.",
  USER_NOT_FOUND: "User not found.",
  POST_NOT_FOUND: "Post not found.",
  INTERNAL_ERROR: "Internal server error.",
}
