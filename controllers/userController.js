import User from "../models/User.js"
import Post from "../models/Post.js"
import Like from "../models/Like.js"
import Follow from "../models/Follow.js"
import Block from "../models/Block.js"
import Activity from "../models/Activity.js"
import { ROLES, ERROR_MESSAGES, ACTIVITY_TYPES } from "../utils/constants.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({
      success: true,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      })
    }

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { username, bio } = req.body
    const userId = req.params.id

    // Check if user is owner of the profile
    if (req.user.userId !== userId && req.user.role !== ROLES.OWNER) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      })
    }

    const updateData = {}
    if (username) updateData.username = username
    if (bio !== undefined) updateData["profile.bio"] = bio

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { ...updateData, updatedAt: new Date() } },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      })
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id

    // Check authorization
    if (![ROLES.ADMIN, ROLES.OWNER].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      })
    }

    // Delete user's posts
    const userPosts = await Post.find({ author: userId })
    await Post.deleteMany({ author: userId })

    // Delete user's likes
    await Like.deleteMany({ user: userId })

    // Delete user's follows
    await Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] })

    // Delete user's blocks
    await Block.deleteMany({ $or: [{ blocker: userId }, { blocked: userId }] })

    // Create activity for user deletion
    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.USER_DELETED,
      target: userId,
      targetModel: "User",
      description: `${req.user.role} deleted user ${user.username}`,
    })

    // Delete the user
    await User.findByIdAndDelete(userId)

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const getUserFollowers = async (req, res) => {
  try {
    const userId = req.params.id
    const followers = await Follow.find({ following: userId }).populate("follower", "username email profile")

    res.status(200).json({
      success: true,
      data: followers,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const getUserFollowing = async (req, res) => {
  try {
    const userId = req.params.id
    const following = await Follow.find({ follower: userId }).populate("following", "username email profile")

    res.status(200).json({
      success: true,
      data: following,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const makeAdmin = async (req, res) => {
  try {
    const { userId } = req.body

    // Only Owner can make admins
    if (req.user.role !== ROLES.OWNER) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: ROLES.ADMIN, updatedAt: new Date() },
      { new: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      })
    }

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.MADE_ADMIN,
      target: userId,
      targetModel: "User",
      description: `${user.username} was made an admin`,
    })

    res.status(200).json({
      success: true,
      message: "User promoted to admin",
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const removeAdmin = async (req, res) => {
  try {
    const { userId } = req.body

    // Only Owner can remove admins
    if (req.user.role !== ROLES.OWNER) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: ROLES.USER, updatedAt: new Date() },
      { new: true },
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      })
    }

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.REMOVED_ADMIN,
      target: userId,
      targetModel: "User",
      description: `${user.username} admin privileges removed`,
    })

    res.status(200).json({
      success: true,
      message: "Admin privileges removed",
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}
