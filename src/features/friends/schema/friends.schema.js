import mongoose from "mongoose";

export const friendSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});
