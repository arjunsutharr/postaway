import OtpRepository from "./otp.repository.js";

export default class OtpController {
  constructor() {
    this.otpRepository = new OtpRepository();
  }

  async sendOtp(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400, "email is required.");
      }

      const resp = await this.otpRepository.sendOtp(email);
      res.status(201).json({ success: true, res: resp });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { otp, email } = req.body;
      if (!otp || !email) {
        return res
          .status(400)
          .json({ success: false, msg: "email and otp is required." });
      }

      const resp = await this.otpRepository.verifyOtp(email, otp);
      res
        .status(200)
        .json({ success: true, msg: "otp verified successfully." });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, msg: "email and password is required." });
      }

      const resp = await this.otpRepository.resetPassword(email, password);
      res
        .status(200)
        .json({ success: true, msg: "Password changed successfully." });
    } catch (error) {
      next(error);
    }
  }
}
