import CommentRepository from "./comment.repository.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async createComment(req, res, next) {
    try {
      const { userId } = req;
      const { postId } = req.params;
      const { content } = req.body;
      if (!postId || !content) {
        return res
          .status(400)
          .json({ success: false, msg: "Post ID and comment is required." });
      }

      const newComment = await this.commentRepository.createComment(
        postId,
        userId,
        content
      );

      if (newComment.success) {
        res.status(201).json({ success: true, res: newComment });
      } else {
        res
          .status(500)
          .json({ success: false, res: "Failed to create comment." });
      }
    } catch (error) {
      next(error);
    }
  }

  async getComments(req, res, next) {
    try {
      const { postId } = req.params;
      if (!postId) {
        return res
          .status(400)
          .json({ success: false, msg: "Post ID is required." });
      }

      const comments = await this.commentRepository.getComments(postId);

      if (comments.success) {
        res.status(200).json({ success: true, res: comments });
      } else {
        res
          .status(500)
          .json({ success: false, res: "Failed to get comments." });
      }
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const { userId } = req;
      const { commentId } = req.params;
      const { content } = req.body;
      if (!commentId || !content) {
        return res
          .status(400)
          .json({ success: false, msg: "Comment ID and comment is required." });
      }

      const updatedComment = await this.commentRepository.updateComment(
        commentId,
        userId,
        content
      );

      if (updatedComment.success) {
        res.status(200).json({ success: true, res: updatedComment });
      } else {
        res
          .status(500)
          .json({ success: false, res: "Failed to update Comment." });
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { userId } = req;
      if (!commentId) {
        return res
          .status(400)
          .json({ success: false, msg: "Comment ID is required." });
      }

      const resp = await this.commentRepository.deleteComment(
        commentId,
        userId
      );

      if (resp.success) {
        res.status(200).json({ success: true, res: "Comment deleted." });
      } else {
        res
          .status(500)
          .json({ success: false, res: "Failed to delete Comment" });
      }
    } catch (error) {
      next(error);
    }
  }
}
