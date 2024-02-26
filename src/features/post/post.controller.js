import PostRepository from "./post.repository.js";

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }

  async createPost(req, res, next) {
    try {
      const user = req.userId;
      const { caption } = req.body;
      if (!req.file && !caption) {
        return res
          .status(400)
          .json({ success: false, error: "image and caption is required." });
      }
      const imageUrl = req.file.filename;
      const post = await this.postRepository.createPost({
        user,
        imageUrl,
        caption,
      });
      res.status(201).json({ success: true, res: post });
    } catch (error) {
      next(error);
    }
  }

  async getPost(req, res, next) {
    try {
      const { postId } = req.params;

      if (!postId) {
        return res
          .status(400)
          .json({ success: false, error: "Post id is required." });
      }

      const post = await this.postRepository.getPost(postId);
      res.status(200).json({ success: true, res: post });
    } catch (error) {
      next(error);
    }
  }

  async getAllPosts(req, res, next) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status.json({ success: false, msg: "user id required" });
      }
      const posts = await this.postRepository.getAllPosts(userId);
      res.status(200).json({ success: true, res: posts });
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req, res, next) {
    try {
      const { userId } = req;
      const { postId } = req.params;

      if (!postId) {
        return res
          .status(400)
          .json({ success: false, msg: "postId is required" });
      }
      if (req.file) {
        const imageUrl = req.file.filename;
        const post = await this.postRepository.updatePost(postId, userId, {
          imageUrl,
          ...req.body,
        });
        res.status(200).json({ success: true, res: post });
      } else {
        const post = await this.postRepository.updatePost(postId, userId, {
          ...req.body,
        });
        res.status(200).json({ success: true, res: post });
      }
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      const { userId } = req;
      const { postId } = req.params;
      if (!postId) {
        return res
          .status(400)
          .json({ success: false, msg: "postId is required" });
      }

      const deletePost = await this.postRepository.deletePost(userId, postId);
      if (deletePost) {
        res.status(200).json({ success: true, msg: "Post deleted" });
      }
    } catch (error) {
      next(error);
    }
  }
}
