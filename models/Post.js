import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

postSchema.pre("populate", function () {
  this.populate("author", "username email profile")
})

export default mongoose.model("Post", postSchema)
