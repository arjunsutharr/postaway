import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { CustomErrorHandler } from "../../error-handler/errorHandler.js";
const PostModel = mongoose.model("post", postSchema);

export default class PostRepository {
  async createPost(post) {
    try {
      const newPost = await new PostModel(post).save();
    } catch (error) {
      throw new CustomErrorHandler(400, error);
    }
  }
}
