import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userSchema } from "./user.schema.js";
import { CustomErrorHandler } from "../../error-handler/errorHandler.js";

const UserModel = mongoose.model("user", userSchema);

export default class UserRepository {
  async signUp(userData) {
    try {
      const { password, name, email, gender } = userData;
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await new UserModel({
        name,
        email,
        password: hashedPassword,
        gender,
      }).save();

      const selectedUserProperties = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
      };
      return selectedUserProperties;
    } catch (error) {
      if (error instanceof mongoose.Error) {
        throw new CustomErrorHandler(400, error);
      } else if (error.name === "MongoServerError" && error.code === 11000) {
        throw new CustomErrorHandler(
          400,
          "Email already exists. Please try a different email address."
        );
      } else if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error);
      } else {
        throw error;
      }
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
        return token;
      } else {
        throw new CustomErrorHandler(400, "Invalid Credentials");
      }
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error);
      } else {
        throw error;
      }
    }
  }

  async logout(userId, token) {
    try {
      const update = await UserModel.updateOne(
        { _id: userId },
        { $pull: { tokens: { token: token } } }
      );

      if (update.modifiedCount > 0) {
        return "Successfully logged out.";
      } else {
        throw new CustomErrorHandler(500, "failed to logout.");
      }
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error);
      } else {
        throw error;
      }
    }
  }

  async logoutAll(userId) {
    try {
      const user = UserModel.findById(userId);
      if (!user) {
        throw new CustomErrorHandler(404, "user not found.");
      }
      await UserModel.updateMany({ _id: userId }, { $pull: { tokens: {} } });
      return "Successfully logged out from all the devices.";
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error);
      } else {
        throw error;
      }
    }
  }

  async searchToken(userId, token) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new CustomErrorHandler(404, "user not found.");
      }

      const foundToken = user.tokens.find(
        (tokenObj) => tokenObj.token == token
      );

      if (!foundToken) {
        throw new CustomErrorHandler(
          400,
          "Unauthorized!! Token no logger usable. Get a new token and try again."
        );
      }
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error);
      } else {
        throw error;
      }
    }
  }

  async get(userId) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new CustomErrorHandler(404, "user not found.");
      }

      const selectedUserProperties = {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      };
      return selectedUserProperties;
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error);
      } else {
        throw error;
      }
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
      throw error;
    }
  }

  async update(userId, updatedDetails) {
    try {
      const { password, ...otherDetails } = updatedDetails;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new CustomErrorHandler(400, "Invalid ID");
      }

      const userExists = await UserModel.findById(userId);

      if (!userExists) {
        throw new CustomErrorHandler(404, "user not found");
      }

      const user = await UserModel.findByIdAndUpdate(userId, otherDetails, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new CustomErrorHandler(
          400,
          "Unauthorized action!!! Only profile owner can change there details."
        );
      }

      const selectedUserProperties = {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
      };
      return selectedUserProperties;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new CustomErrorHandler(400, error);
      } else if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error);
      } else {
        throw error;
      }
    }
  }
}
