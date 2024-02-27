import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    maxLength: [30, "Maximum 30 characters accepted."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: { message: "This email address is already registered." },
    match: [
      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Transgender", "Other"],
    required: [true, "Please choose one from Male, Female, Transgender, Other"],
  },
  tokens: [{ token: String }],
});
