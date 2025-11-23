import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
import { ROLES } from "../utils/constants.js"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /.+@.+\..+/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER,
  },
  profile: {
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
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

// Use an async pre-save hook without the `next` callback. Mongoose
// treats async middleware as promise-based and does not provide a
// `next` argument — calling `next()` here caused "next is not a function".
userSchema.pre("save", async function () {
  // Skip if password is not modified
  if (!this.isModified("password")) {
    return
  }

  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
  } catch (error) {
    // Throw error so Mongoose will reject the save promise and
    // propagate the error to the caller (Express error handler).
    throw error
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password)
}

// Remove password from response
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

export default mongoose.model("User", userSchema)
