import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password, gender } = req.body;

      if (!name || !email || !password || !gender) {
        return res.status(400).json({
          success: false,
          msg: "All fields name, email, password and gender is required.",
        });
      }
      const user = await this.userRepository.signUp(req.body);
      res.status(201).json({ success: true, res: user });
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, msg: "Please provide email and password" });
      }
      const token = await this.userRepository.signIn(email, password);

      res.status(200).json({
        success: true,
        msg: "User login successful.",
        token: token,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const userId = req.userId;
      const resp = await this.userRepository.logout(userId, token);

      res.status(200).json({ success: true, msg: resp });
    } catch (error) {
      next(error);
    }
  }

  async logoutAll(req, res, next) {
    try {
      const userId = req.userId;
      const resp = await this.userRepository.logoutAll(userId);

      res.status(200).json({
        success: true,
        msg: resp,
      });
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        res.status(400).json({ success: false, msg: "User id is required." });
      }
      const user = await this.userRepository.get(userId);
      res.status(200).json({ success: true, res: user });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await this.userRepository.getAll();
      res.status(200).json({ success: true, users: users });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const givenUserId = req.params.userId;
      const updateDetails = req.body;
      const { userId } = req;

      if (!givenUserId) {
        return res
          .status(400)
          .json({ success: false, msg: "User id is required." });
      }

      if (givenUserId !== userId) {
        return res.status(400).json({
          success: false,
          msg: "Only profile owner can change there details",
        });
      }

      if (!updateDetails) {
        return res
          .status(400)
          .json({ success: false, msg: "User updated details are required." });
      }

      const updatedUser = await this.userRepository.update(
        userId,
        updateDetails
      );

      res.status(200).json({ success: true, res: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}
