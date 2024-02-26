import express from "express";
import LikeController from "./like.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

const router = express.Router();
const likeController = new LikeController();

// Get likes for a specific post or comment
router.get("/:id", jwtAuth, (req, res, next) => {
  likeController.getLikes(req, res, next);
});

// Toggle like on a post or comment.
router.get("/toggle/:id", jwtAuth, (req, res, next) => {
  likeController.toggleLike(req, res, next);
});

export default router;
