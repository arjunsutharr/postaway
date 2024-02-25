import jwt from "jsonwebtoken";
import UserRepository from "../features/user/user.repository.js";
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
        if (foundToken.success) {
          next();
        } else {
          res.status(400).json({
            success: false,
            msg: foundToken.res,
          });
        }
      } catch (error) {
        res.status(500).json({
          success: false,
          msg: "something went wrong!! try later!",
        });
      }
    }
  });
};

export default jwtAuth;
