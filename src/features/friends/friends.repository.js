import mongoose from "mongoose";
import { friendSchema } from "./schema/friends.schema.js";
import { friendRequestSchema } from "./schema/friendRequests.schema.js";
import { userSchema } from "../user/user.shcema.js";
import { CustomErrorHandler } from "../../error-handler/errorHandler.js";

const FriendModel = mongoose.model("friend", friendSchema);
const FriendRequestModel = mongoose.model("friendRequest", friendRequestSchema);
const UserModel = mongoose.model("user", userSchema);
export default class FriendsRepository {
  async getFriends(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new CustomErrorHandler(400, "Invalid user ID.");
      }

      const isValidUser = await UserModel.findById(userId);

      if (!isValidUser) {
        throw new CustomErrorHandler(400, "Invalid user ID");
      }

      const friendsData = await FriendModel.find({
        user: userId,
      })
        .select("friends")
        .populate({
          path: "friends",
          select: { name: 1, email: 1 },
        });

      if (!friendsData || friendsData.length === 0) {
        throw new CustomErrorHandler(404, "No friends found.");
      }

      const populatedData = friendsData.map((friend) => {
        return friend.friends;
      });

      return { success: true, res: populatedData };
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  async toggleFriendship(userId, friendId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(friendId)) {
        throw new CustomErrorHandler(400, "Invalid friend ID.");
      }

      const friendUser = await UserModel.findById(friendId);

      if (!friendUser) {
        throw new CustomErrorHandler(400, "Invalid friend ID");
      }

      // Attempt to unfriend
      const unfriend = await FriendModel.findOneAndUpdate(
        { user: userId, friends: { $in: [friendId] } },
        { $pull: { friends: friendId } }
      );

      if (unfriend) {
        return { success: true, res: "Unfriended successfully" };
      } else {
        // check if friend request already exist and if not then create a friend request
        const requestExists = await FriendRequestModel.findOne({
          user: friendId,
          friendRequests: { $in: [userId] },
        });

        if (requestExists) {
          throw new CustomErrorHandler(400, "Friend request already sent.");
        }

        // if user already exist in friendRequest collection then just add the new request to array else create one
        const updateRequests = await FriendRequestModel.findOneAndUpdate(
          { user: friendId },
          { $push: { friendRequests: userId } },
          { new: true }
        );

        if (!updateRequests) {
          const newFriendRequest = new FriendRequestModel({
            user: friendId,
            friendRequests: [userId],
          });

          await newFriendRequest.save();
          return {
            success: true,
            msg: "Friend request sent successfully",
            res: newFriendRequest,
          };
        }
        return {
          success: true,
          msg: "Friend request sent successfully",
          res: updateRequests,
        };
      }
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

  async getRequests(userId) {
    try {
      const pendingRequests = await FriendRequestModel.find({
        user: userId,
      }).populate({
        path: "friendRequests",
        select: { name: 1, email: 1 },
      });

      if (
        !pendingRequests ||
        pendingRequests.length === 0 ||
        !pendingRequests.friendRequests ||
        pendingRequests.friendRequests.length === 0
      ) {
        throw new CustomErrorHandler(404, "No pending Requests found.");
      }

      const response = pendingRequests[0].friendRequests;

      return { success: true, res: response };
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }

  async acceptRequest(userId, friendRequestId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(friendRequestId)) {
        throw new CustomErrorHandler(400, "Invalid friend ID.");
      }

      const isValidUser = await UserModel.findById(friendRequestId);

      if (!isValidUser) {
        throw new CustomErrorHandler(400, "Invalid friend ID");
      }

      const updateRequests = await FriendRequestModel.findOneAndUpdate(
        { user: userId, friendRequests: { $in: [friendRequestId] } },
        { $pull: { friendRequests: friendRequestId } }
      );

      if (!updateRequests) {
        throw new CustomErrorHandler(404, "Request not found.");
      }

      const updateFriends = await FriendModel.findOneAndUpdate(
        { user: userId },
        { $push: { friends: friendRequestId } },
        { new: true }
      );

      if (!updateFriends) {
        const newFriend = new FriendModel({
          user: userId,
          friends: [friendRequestId],
        });

        await newFriend.save();

        return {
          success: true,
          msg: "Friend request accepted.",
          res: newFriend,
        };
      }

      return {
        success: true,
        msg: "Friend request accepted.",
        res: updateFriends,
      };
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

  async rejectRequest(userId, friendRequestId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(friendRequestId)) {
        throw new CustomErrorHandler(400, "Invalid friend ID.");
      }

      const isValidUser = await UserModel.findById(friendRequestId);

      if (!isValidUser) {
        throw new CustomErrorHandler(400, "Invalid friend ID");
      }

      const updateRequests = await FriendRequestModel.findOneAndUpdate(
        { user: userId, friendRequests: { $in: [friendRequestId] } },
        { $pull: { friendRequests: friendRequestId } }
      );

      if (!updateRequests) {
        throw new CustomErrorHandler(404, "Request not found.");
      }

      return {
        success: true,
        res: "Friend request rejected.",
      };
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }
}
