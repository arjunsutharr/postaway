import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { CustomErrorHandler } from "../../error-handler/errorHandler.js";
const PostModel = mongoose.model("post", postSchema);

export default class PostRepository {
  async createPost(post) {
    try {
      const newPost = await new PostModel(post).save();
      return newPost;
    } catch (error) {
      throw new CustomErrorHandler(400, error);
    }
  }

  async getPost(postId) {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new CustomErrorHandler(400, "Post not found");
      }
      return post;
    } catch (error) {
      throw new CustomErrorHandler(400, error);
    }
  }

  async updatePost(postId, userId, postDetails) {
    try {
      const { _id, user, ...otherDetails } = postDetails;
      const post = await PostModel.findOneAndUpdate(
        { _id: postId, user: userId },
        otherDetails,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!post) {
        throw new CustomErrorHandler(400, "Post not found");
      }
      return post;
    } catch (error) {
      throw new CustomErrorHandler(400, error);
    }
  }

  async deletePost(userId, postId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new CustomErrorHandler(400, "Invalid post");
      }

      if (!(await this.isAuthorized(userId, postId))) {
        throw new CustomErrorHandler(403, "Unauthorized deletion");
      }
      const post = await PostModel.findOneAndDelete({
        _id: postId,
        user: userId,
      });
      if (!post) {
        throw new CustomErrorHandler(400, "post not found");
      }
      return true;
    } catch (error) {
      throw new CustomErrorHandler(error.statusCode, error);
    }
  }

  async isAuthorized(userId, postId) {
    try {
      const post = await PostModel.findById(postId);
      console.log(post);
      if (!post) {
        throw new CustomErrorHandler(404, "Post not found");
      }

      return post.user === userId ? true : false;
    } catch (error) {
      throw new CustomErrorHandler(error.statusCode, error);
    }
  }
}
