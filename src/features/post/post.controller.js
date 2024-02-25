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
    } catch (error) {
      next(error);
    }
  }
}
