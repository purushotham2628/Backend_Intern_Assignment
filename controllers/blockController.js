import Block from "../models/Block.js"
import User from "../models/User.js"
import Activity from "../models/Activity.js"
import { ERROR_MESSAGES, ACTIVITY_TYPES } from "../utils/constants.js"

export const blockUser = async (req, res) => {
  try {
    const { blockedId } = req.body

    // Cannot block yourself
    if (blockedId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself",
      })
    }

    // Check if user exists
    const userToBlock = await User.findById(blockedId)
    if (!userToBlock) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      })
    }

    // Check if already blocked
    const existingBlock = await Block.findOne({ blocker: req.user.userId, blocked: blockedId })
    if (existingBlock) {
      return res.status(400).json({
        success: false,
        message: "User already blocked",
      })
    }

    const block = new Block({
      blocker: req.user.userId,
      blocked: blockedId,
    })

    await block.save()
    await block.populate(["blocker", "blocked"], "username email profile")

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.BLOCKED_USER,
      target: blockedId,
      targetModel: "User",
      description: `${block.blocker.username} blocked ${userToBlock.username}`,
    })

    res.status(201).json({
      success: true,
      message: "User blocked successfully",
      data: block,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const unblockUser = async (req, res) => {
  try {
    const blockedId = req.params.blockedId

    const block = await Block.findOne({ blocker: req.user.userId, blocked: blockedId })

    if (!block) {
      return res.status(404).json({
        success: false,
        message: "User not blocked",
      })
    }

    const unblockedUser = await User.findById(blockedId)

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.UNBLOCKED_USER,
      target: blockedId,
      targetModel: "User",
      description: `User unblocked ${unblockedUser.username}`,
    })

    await Block.findByIdAndDelete(block._id)

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const getBlockedUsers = async (req, res) => {
  try {
    const blocks = await Block.find({ blocker: req.user.userId }).populate("blocked", "username email profile")

    res.status(200).json({
      success: true,
      data: blocks,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}
