import Post from "../models/Post.js"
import Activity from "../models/Activity.js"
import Block from "../models/Block.js"
import Like from "../models/Like.js"
import { ROLES, ERROR_MESSAGES, ACTIVITY_TYPES } from "../utils/constants.js"

export const createPost = async (req, res) => {
  try {
    const { content } = req.body

    const post = new Post({
      content,
      author: req.user.userId,
    })

    await post.save()
    await post.populate("author", "username email profile")

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.CREATED_POST,
      target: post._id,
      targetModel: "Post",
      description: `${post.author.username} created a post`,
    })

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Get blocked users
    const blockedUsers = await Block.find({ blocker: req.user.userId }).select("blocked")
    const blockedUserIds = blockedUsers.map((b) => b.blocked)

    // Get posts excluding blocked users' posts
    const posts = await Post.find({ author: { $nin: blockedUserIds } })
      .populate("author", "username email profile")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Post.countDocuments({ author: { $nin: blockedUserIds } })

    res.status(200).json({
      success: true,
      data: posts,
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

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username email profile")

    if (!post) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.POST_NOT_FOUND,
      })
    }

    // Check if user is blocked
    const isBlocked = await Block.findOne({
      blocker: post.author._id,
      blocked: req.user.userId,
    })

    if (isBlocked) {
      return res.status(403).json({
        success: false,
        message: "You cannot view this post",
      })
    }

    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const updatePost = async (req, res) => {
  try {
    const { content } = req.body
    const postId = req.params.id

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.POST_NOT_FOUND,
      })
    }

    // Check if user is owner of post
    if (post.author.toString() !== req.user.userId && req.user.role !== ROLES.OWNER) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      })
    }

    post.content = content || post.content
    post.updatedAt = new Date()
    await post.save()
    await post.populate("author", "username email profile")

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id

    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.POST_NOT_FOUND,
      })
    }

    // Check authorization
    if (post.author.toString() !== req.user.userId && ![ROLES.ADMIN, ROLES.OWNER].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      })
    }

    // Delete associated likes
    await Like.deleteMany({ post: postId })

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.DELETED_POST,
      target: postId,
      targetModel: "Post",
      description: `Post deleted by ${req.user.role}`,
    })

    await Post.findByIdAndDelete(postId)

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}
