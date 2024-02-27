import mongoose from "mongoose";

export const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"],
  },
  otp: {
    type: Number,
    required: [true, "Otp is required"],
  },
  verified: {
    type: Boolean,
    default: false,
  },
});
