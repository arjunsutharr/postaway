import express from "express";
import OtpController from "./otp.controller.js";

const router = express.Router();
const otpController = new OtpController();

// Send an OTP for password reset
router.post("/send", (req, res, next) => {
  otpController.sendOtp(req, res, next);
});

// Verify an OTP
router.post("/verify", (req, res, next) => {
  otpController.verifyOtp(req, res, next);
});

// Reset the user's password
router.post("/reset-password", (req, res, next) => {
  otpController.resetPassword(req, res, next);
});

export default router;
