import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Please provide user ID"],
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "on_model",
    required: [true, "Please provide a comment ID or post ID"],
  },
  on_model: {
    type: String,
    required: [true, "Invalid!! Please choose comment or post"],
    enum: ["comment", "post"],
  },
});
