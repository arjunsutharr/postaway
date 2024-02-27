import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "./user.schema.js";
import { CustomErrorHandler } from "../../error-handler/errorHandler.js";

const UserModel = mongoose.model("user", userSchema);

export default class UserRepository {
  async signUp(userData) {
    try {
      let { password } = userData;
      password = await bcrypt.hash(password, 12);
      const newUser = await new UserModel({
        ...userData,
        password,
      }).save();

      const selectedUserProperties = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
      };
      return { success: true, res: selectedUserProperties };
    } catch (error) {
      throw new CustomErrorHandler(400, error);
    }
  }

  async signIn(email, password) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new CustomErrorHandler(404, "user not found");
      }

      const passwordValidate = await bcrypt.compare(password, user.password);
      if (passwordValidate) {
        const token = jwt.sign(
          { userId: user._id, user: user },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

        user.tokens.push({ token });
        await user.save();
        return { success: true, res: token };
      } else {
        throw new CustomErrorHandler(400, "Invalid Credentials");
      }
    } catch (error) {
      throw new CustomErrorHandler(error.statusCode, error);
    }
  }

  async logout(userId, token) {
    try {
      const update = await UserModel.updateOne(
        { _id: userId },
        { $pull: { tokens: { token: token } } }
      );

      if (update.modifiedCount > 0) {
        return { success: true, res: "Successfully logged out." };
      } else {
        return { success: false, res: "failed to logout" };
      }
    } catch (error) {
      throw new CustomErrorHandler(
        500,
        "Error while logging out! Please try later."
      );
    }
  }

  async logoutAll(userId) {
    try {
      const user = UserModel.findById(userId);
      if (!user) {
        return { success: false, res: "User not found" };
      }
      await UserModel.updateMany({ _id: userId }, { $pull: { tokens: {} } });
      return { success: true };
    } catch (error) {
      throw new CustomErrorHandler(
        500,
        "Error while logging out! Please try later."
      );
    }
  }

  async searchToken(userId, token) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return { success: false, res: "user not found" };
      }
      const foundToken = user.tokens.find(
        (tokenObj) => tokenObj.token == token
      );
      if (!foundToken) {
        return {
          success: false,
          res: "Unauthorized!! Token no logger usable. login to continue.",
        };
      } else {
        return { success: true };
      }
    } catch (error) {
      throw new CustomErrorHandler(500, "server error! please  try later");
    }
  }

  async get(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (user) {
        const selectedUserProperties = {
          id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
        };
        return { success: true, res: selectedUserProperties };
      } else {
        return false;
      }
    } catch (error) {
      throw new CustomErrorHandler(
        500,
        "Error while getting the user details please try later."
      );
    }
  }

  async getAll() {
    try {
      return await UserModel.find(
        {},
        {
          _id: 1,
          name: 1,
          email: 1,
          gender: 1,
        }
      );
    } catch (error) {
      throw new CustomErrorHandler(
        500,
        "Error while getting the user details please try later."
      );
    }
  }

  async update(userId, updatedDetails) {
    try {
      const { password, ...otherDetails } = updatedDetails;
      const user = await UserModel.findByIdAndUpdate(userId, otherDetails, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new CustomErrorHandler(400, "User not found");
      }

      const selectedUserProperties = {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      };
      return selectedUserProperties;
    } catch (error) {
      console.log(error);
      throw new CustomErrorHandler(
        500,
        "Failed to update the user details!! Please try later!"
      );
    }
  }
}
