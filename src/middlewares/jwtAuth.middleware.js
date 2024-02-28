import jwt from "jsonwebtoken";
import UserRepository from "../features/user/user.repository.js";
import { CustomErrorHandler } from "../error-handler/errorHandler.js";
const userRepository = new UserRepository();

const jwtAuth = async (req, res, next) => {
  const jwtToken = req.headers["authorization"];

  jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      res
        .status(400)
        .json({ success: false, msg: "Unauthorized! login to continue!" });
    } else {
      req.userId = data.userId;
      req.user = data.user;
      try {
        const foundToken = await userRepository.searchToken(
          req.userId,
          jwtToken
        );

        next();
      } catch (error) {
        next(error);
      }
    }
  });
};

export default jwtAuth;
