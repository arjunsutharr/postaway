import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";
import CommentController from "./comment.controller.js";

const router = express.Router();
const commentController = new CommentController();

// Get comments for a specific post
router.get("/:postId", jwtAuth, (req, res, next) => {
  commentController.getComments(req, res, next);
});

// Add a comment to a specific post.
router.post("/:postId", jwtAuth, (req, res, next) => {
  commentController.createComment(req, res, next);
});

// Update a specific comment.
router.put("/:commentId", jwtAuth, (req, res, next) => {
  commentController.updateComment(req, res, next);
});

//Delete a specific comment.
router.delete("/:commentId", jwtAuth, (req, res, next) => {
  commentController.deleteComment(req, res, next);
});

export default router;
