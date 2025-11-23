import Like from "../models/Like.js"
import Post from "../models/Post.js"
import Activity from "../models/Activity.js"
import { ERROR_MESSAGES, ACTIVITY_TYPES, ROLES } from "../utils/constants.js"

export const likePost = async (req, res) => {
  try {
    const { postId } = req.body

    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.POST_NOT_FOUND,
      })
    }

    // Check if already liked
    const existingLike = await Like.findOne({ user: req.user.userId, post: postId })
    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      })
    }

    const like = new Like({
      user: req.user.userId,
      post: postId,
    })

    await like.save()
    await like.populate("user", "username email")

    const author = await Post.findById(postId).select("author").populate("author", "username")

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.LIKED_POST,
      target: postId,
      targetModel: "Post",
      description: `${(await like.populate("user", "username")).user.username} liked ${author.author.username}'s post`,
    })

    res.status(201).json({
      success: true,
      message: "Post liked successfully",
      data: like,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId

    const like = await Like.findOne({ user: req.user.userId, post: postId })

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      })
    }

    const likerUser = await Like.findById(like._id).populate("user", "username")

    await Activity.create({
      actor: req.user.userId,
      action: ACTIVITY_TYPES.UNLIKED_POST,
      target: postId,
      targetModel: "Post",
      description: `${likerUser.user.username} unliked a post`,
    })

    await Like.findByIdAndDelete(like._id)

    res.status(200).json({
      success: true,
      message: "Post unliked successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const getPostLikes = async (req, res) => {
  try {
    const postId = req.params.postId

    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.POST_NOT_FOUND,
      })
    }

    const likes = await Like.find({ post: postId }).populate("user", "username email profile")

    res.status(200).json({
      success: true,
      data: likes,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}

export const deleteLike = async (req, res) => {
  try {
    const likeId = req.params.likeId

    const like = await Like.findById(likeId)
    if (!like) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      })
    }

    // Check authorization - Admin/Owner can delete any like
    if (like.user.toString() !== req.user.userId && ![ROLES.ADMIN, ROLES.OWNER].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: ERROR_MESSAGES.FORBIDDEN,
      })
    }

    await Like.findByIdAndDelete(likeId)

    res.status(200).json({
      success: true,
      message: "Like deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.INTERNAL_ERROR,
      error: error.message,
    })
  }
}
