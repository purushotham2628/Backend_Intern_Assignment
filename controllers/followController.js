import Follow from "../models/Follow.js"
import User from "../models/User.js"
import Activity from "../models/Activity.js"
import { ERROR_MESSAGES, ACTIVITY_TYPES } from "../utils/constants.js"

export const followUser = async (req, res) => {
  try {
    const { followingId } = req.body

    // Cannot follow yourself
    if (followingId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      })
    }

    // Check if user exists
    const userToFollow = await User.findById(followingId)
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      })
    }

    // Check if already following
    const existingFollow = await Follow.findOne({ follower: req.user.userId, following: followingId })
    if (existingFollow) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      })
    }

    const follow = new Follow({
      follower: req.user.userId,
      following: followingId,
    })

    await follow.save()
    await follow.populate(["follower", "following"], "username email profile")

    const followerUser = await User.findById(req.user.userId)

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.FOLLOWED_USER,
      target: followingId,
      targetModel: "User",
      description: `${followerUser.username} followed ${userToFollow.username}`,
    })

    res.status(201).json({
      success: true,
      message: "User followed successfully",
      data: follow,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const unfollowUser = async (req, res) => {
  try {
    const followingId = req.params.followingId

    const follow = await Follow.findOne({ follower: req.user.userId, following: followingId })

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "Not following this user",
      })
    }

    const userToUnfollow = await User.findById(followingId)

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.UNFOLLOWED_USER,
      target: followingId,
      targetModel: "User",
      description: `User unfollowed ${userToUnfollow.username}`,
    })

    await Follow.findByIdAndDelete(follow._id)

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const getFollowStatus = async (req, res) => {
  try {
    const userId = req.params.userId

    const isFollowing = await Follow.findOne({ follower: req.user.userId, following: userId })

    res.status(200).json({
      success: true,
      isFollowing: !!isFollowing,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}
