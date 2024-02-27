import FriendsRepository from "./friends.repository.js";

export default class FriendsController {
  constructor() {
    this.friendsRepository = new FriendsRepository();
  }

  async getFriends(req, res, next) {
    try {
      const { userId } = req.params;

      const requests = await this.friendsRepository.getFriends(userId);

      if (requests.success) {
        res.status(200).json({ success: true, res: requests.res });
      }
    } catch (error) {
      next(error);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const { userId } = req;

      const requests = await this.friendsRepository.getRequests(userId);

      if (requests.success) {
        res.status(200).json({ success: true, res: requests.res });
      }
    } catch (error) {
      next(error);
    }
  }

  async toggleFriendship(req, res, next) {
    try {
      const { userId } = req;
      const { friendId } = req.params;

      if (!friendId) {
        return res
          .status(400)
          .json({ success: false, msg: "Friend ID is required." });
      }

      if (userId == friendId) {
        return res.status(400).json({
          success: false,
          msg: "You cannot send a friend request to yourself.",
        });
      }

      const resp = await this.friendsRepository.toggleFriendship(
        userId,
        friendId
      );

      if (resp.success) {
        res.status(200).json({ success: true, msg: resp.msg, res: resp.res });
      } else {
        res.status(400).json({ success: false, res: resp.res });
      }
    } catch (error) {
      next(error);
    }
  }

  async acceptRequest(req, res, next) {
    try {
      const { userId } = req;
      const { friendId } = req.params;

      if (!friendId) {
        return res
          .status(400)
          .json({ success: false, msg: "Friend ID is required." });
      }
      const resp = await this.friendsRepository.acceptRequest(userId, friendId);

      if (resp.success) {
        res.status(200).json({ success: true, msg: resp.msg, res: resp.res });
      }
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const { userId } = req;
      const { friendId } = req.params;

      if (!friendId) {
        return res
          .status(400)
          .json({ success: false, msg: "Friend ID is required." });
      }
      const resp = await this.friendsRepository.rejectRequest(userId, friendId);

      if (resp.success) {
        res.status(200).json({ success: true, res: resp.res });
      }
    } catch (error) {
      next(error);
    }
  }
}
