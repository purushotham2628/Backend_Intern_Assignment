import Activity from "../models/Activity.js"
import Block from "../models/Block.js"
import { ERROR_MESSAGES } from "../utils/constants.js"

export const getActivityFeed = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Get users blocked by current user
    const blockedUsers = await Block.find({ blocker: req.user.userId }).select("blocked")
    const blockedUserIds = blockedUsers.map((b) => b.blocked)

    // Get activity excluding blocked users' activities
    const activities = await Activity.find({
      actor: { $nin: blockedUserIds },
    })
      .populate("actor", "username email profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Activity.countDocuments({
      actor: { $nin: blockedUserIds },
    })

    res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const getUserActivities = async (req, res) => {
  try {
    const userId = req.params.userId
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const activities = await Activity.find({ actor: userId })
      .populate("actor", "username email profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Activity.countDocuments({ actor: userId })

    res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}
