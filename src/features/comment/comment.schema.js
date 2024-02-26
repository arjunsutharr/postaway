import mongoose from "mongoose";
export const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Post id is required."],
    ref: "post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User id is required."],
    ref: "user",
  },
  content: {
    type: String,
    required: [true, "Comment is required."],
  },
});
