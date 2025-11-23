import mongoose from "mongoose"
import { ACTIVITY_TYPES } from "../utils/constants.js"

const activitySchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  action: {
    type: String,
    enum: Object.values(ACTIVITY_TYPES),
    required: true,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "targetModel",
    required: true,
  },
  targetModel: {
    type: String,
    enum: ["Post", "User"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
})

// Auto-populate actor details
activitySchema.pre(/^find/, function () {
  this.populate("actor", "username email")
})

export default mongoose.model("Activity", activitySchema)
