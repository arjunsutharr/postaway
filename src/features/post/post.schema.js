import mongoose from "mongoose";
export const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User id is required."],
    ref: "user",
  },
  imageUrl: {
    type: String,
    required: [true, "image is required."],
  },
  caption: {
    type: String,
    required: [true, "Comment is required."],
  },
});
