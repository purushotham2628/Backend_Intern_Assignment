import mongoose from "mongoose"

const blockSchema = new mongoose.Schema({
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blocked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Unique index to prevent duplicate blocks
blockSchema.index({ blocker: 1, blocked: 1 }, { unique: true })

export default mongoose.model("Block", blockSchema)
