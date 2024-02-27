import mongoose from "mongoose";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { otpSchema } from "./otp.schema.js";
import { userSchema } from "../user/user.schema.js";
import { CustomErrorHandler } from "../../error-handler/errorHandler.js";
const OtpModel = mongoose.model("otp", otpSchema);
const UserModel = mongoose.model("user", userSchema);

export default class OtpRepository {
  async sendOtp(email) {
    try {
      const validMail = await UserModel.findOne({ email });

      if (!validMail) {
        throw new CustomErrorHandler(400, "Email not found");
      }

      const otp = this.generateOtp();

      await OtpModel.create({
        email,
        otp,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "arjunasuthar70@gmail.com",
          pass: "hdznqomirbkdmcok",
        },
      });

      const mailOptions = {
        from: "arjunasuthar70@gmail.com",
        to: email,
        subject: "OTP for password reset",
        text: `Hi,
${otp} is your OTP for password reset.
Please do not share this OTP with anyone.`,
      };

      await transporter.sendMail(mailOptions);
      return `OTP sent to ${email}`;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  async verifyOtp(email, otp) {
    try {
      const validOtp = await OtpModel.findOneAndUpdate(
        { email, otp },
        { verified: true }
      );
      if (!validOtp) {
        throw new CustomErrorHandler(400, "Invalid otp.");
      }

      return true;
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  async resetPassword(email, password) {
    try {
      const isValid = await OtpModel.findOneAndDelete({
        email,
        verified: true,
      });

      if (!isValid) {
        throw new CustomErrorHandler(
          400,
          "Unauthorized action. link is expried please verify otp again and reset the password."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await UserModel.findOneAndUpdate(
        { email },
        { password: hashedPassword, $pull: { tokens: {} } }
      );

      if (!user) {
        throw new CustomErrorHandler(400, "user not found");
      }

      return { success: true };
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  generateOtp() {
    const baseNumber = Math.pow(10, 6);
    let otp = Math.floor(Math.random() * baseNumber);
    while (otp < 100000) {
      otp += baseNumber;
    }

    return otp;
  }
}
