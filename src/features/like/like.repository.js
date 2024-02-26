import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { commentSchema } from "../comment/comment.schema.js";
import { postSchema } from "../post/post.schema.js";
import { CustomErrorHandler } from "../../error-handler/errorHandler.js";

const LikeModel = mongoose.model("like", likeSchema);
const CommentModel = mongoose.model("comment", commentSchema);
const PostModel = mongoose.model("post", postSchema);

export default class LIkeRepository {
  async toggleLike(userId, id, type) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomErrorHandler(400, "Invalid ID");
      }

      const lowerCaseType = type.toLowerCase().trim();

      if (lowerCaseType == "comment") {
        const comment = await CommentModel.findById(id);
        if (!comment) {
          throw new CustomErrorHandler(404, "Comment not found.");
        }
      } else if (lowerCaseType == "post") {
        const post = await PostModel.findById(id);
        if (!post) {
          throw new CustomErrorHandler(404, "Post not found");
        }
      }

      const alreadyLiked = await LikeModel.findOne({
        likeable: id,
        user: userId,
      });

      if (!alreadyLiked) {
        const newLike = new LikeModel({
          user: userId,
          likeable: id,
          on_model: lowerCaseType,
        });
        await newLike.save();
        return { success: true, res: newLike };
      } else {
        const removeLike = await LikeModel.findOneAndDelete({ likeable: id });

        if (removeLike) {
          return { success: true, res: "like removed" };
        }
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

  async getLikes(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CustomErrorHandler(400, "Invalid ID");
      }

      const likes = await LikeModel.find({ likeable: id })
        .populate({
          path: "user",
          select: { _id: 1, name: 1, email: 1 },
        })
        .populate("likeable");

      if (!likes || likes.length === 0) {
        throw new CustomErrorHandler(404, "Likes not found");
      }

      return { success: true, res: likes };
    } catch (error) {
      if (error instanceof CustomErrorHandler) {
        throw new CustomErrorHandler(error.statusCode, error.message);
      } else {
        throw error;
      }
    }
  }
}
