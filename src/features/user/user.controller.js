import UserRepository from "./user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      const user = await this.userRepository.signUp(req.body);
      if (user.success) {
        res.status(201).json({ success: true, res: user.res });
      }
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, msg: "Please provide email and password" });
      }
      const user = await this.userRepository.signIn(email, password);
      if (user.success) {
        res.status(200).json({
          success: true,
          msg: "User login successful.",
          token: user.res,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const token = req.headers["authorization"];
      const userId = req.userId;
      const resp = await this.userRepository.logout(userId, token);
      if (resp.success) {
        res.status(200).json({ success: true, msg: resp.res });
      } else {
        res.status(400).json({ success: false, msg: resp.res });
      }
    } catch (error) {
      next(error);
    }
  }

  async logoutAll(req, res, next) {
    try {
      const userId = req.userId;
      const resp = await this.userRepository.logoutAll(userId);
      if (resp.success) {
        res.status(200).json({
          success: true,
          msg: "Successfully logged out from all the devices.",
        });
      } else {
        res.status(400).json({
          success: false,
          msg: resp.res,
        });
      }
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
      if (user.success) {
        res.status(200).json({ success: true, res: user.res });
      } else {
        res.status(404).json({ success: false, msg: "User not found." });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await this.userRepository.getAll();
      if (users) {
        res.status(200).json({ success: true, users: users });
      } else {
        res.status(404).json({ success: false, msg: "Users not found." });
      }
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const userId = req.params.userId;
      const updateDetails = req.body;
      if (!userId) {
        res.status(400).json({ success: false, msg: "User id is required." });
      }
      if (!updateDetails) {
        res
          .status(400)
          .json({ success: false, msg: "User updated details are required." });
      }
      const updatedUser = await this.userRepository.update(
        userId,
        updateDetails
      );
      if (updatedUser) {
        res.status(200).json({ success: true, res: updatedUser });
      }
    } catch (error) {
      next(error);
    }
  }
}
