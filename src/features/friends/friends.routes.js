import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";
import FriendsController from "./friends.controller.js";

const router = express.Router();
const friendsController = new FriendsController();

// Get a user's friends
router.get("/get-friends/:userId", jwtAuth, (req, res, next) => {
  friendsController.getFriends(req, res, next);
});

// Get pending friend requests
router.get("/get-pending-requests", jwtAuth, (req, res, next) => {
  friendsController.getPendingRequests(req, res, next);
});

// Toggle friendship with another user
router.get("/toggle-friendship/:friendId", jwtAuth, (req, res, next) => {
  friendsController.toggleFriendship(req, res, next);
});

//Accept a friend request
router.get("/response-to-request/:friendId", jwtAuth, (req, res, next) => {
  friendsController.acceptRequest(req, res, next);
});

// Reject a friend request
router.delete("/response-to-request/:friendId", jwtAuth, (req, res, next) => {
  friendsController.rejectRequest(req, res, next);
});

export default router;
