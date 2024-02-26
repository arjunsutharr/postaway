import mongoose, { MongooseError } from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { CustomErrorHandler } from "../../error-handler/errorHandler.js";
import { postSchema } from "../post/post.schema.js";

const CommentModel = mongoose.model("comment", commentSchema);
const PostModel = mongoose.model("post", postSchema);

export default class CommentRepository {
  async createComment(postId, userId, content) {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(postId) ||
        typeof content !== "string"
      ) {
        throw new CustomErrorHandler(
          400,
          "Invalid post ID or comment must be a string"
        );
      }

      const foundPost = await PostModel.findById(postId);

      if (!foundPost) {
        throw new CustomErrorHandler(404, "Post not found");
      }
      const newComment = new CommentModel({
        post: postId,
        user: userId,
        content: content,
      });
      await newComment.save();
      return { success: true, res: newComment };
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

  async getComments(postId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new CustomErrorHandler(400, "Invalid post id");
      }
      const comments = await CommentModel.find({ post: postId });

      if (comments.length === 0) {
        throw new CustomErrorHandler(404, "Comments not found.");
      }
      return { success: true, res: comments };
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw new CustomErrorHandler(500, "Server Error!! Please Try Later!");
      }
    }
  }

  async updateComment(commentId, userId, content) {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(commentId) ||
        typeof content !== "string"
      ) {
        throw new CustomErrorHandler(
          400,
          "Invalid comment ID or comment must be a string."
        );
      }

      const comment = await CommentModel.findById(commentId);

      if (!comment) {
        throw new CustomErrorHandler(404, "Comment not found.");
      }

      const updatedComment = await CommentModel.findOneAndUpdate(
        {
          _id: commentId,
          user: userId,
        },
        { content }
      );
      if (!updatedComment) {
        throw new CustomErrorHandler(
          400,
          "Comment can only be deleted by its owner."
        );
      }

      return { success: true, res: updatedComment };
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

  async deleteComment(commentId, userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new CustomErrorHandler(400, "Invalid comment ID");
      }

      const comment = await CommentModel.findById(commentId);

      if (!comment) {
        throw new CustomErrorHandler(404, "Comment not found.");
      }

      const deletedComment = await CommentModel.findOneAndDelete({
        _id: commentId,
        user: userId,
      });

      if (!deletedComment) {
        throw new CustomErrorHandler(
          400,
          "Unauthorized deletion!! Comment can only be deleted by its owner."
        );
      }

      return { success: true };
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }
}
