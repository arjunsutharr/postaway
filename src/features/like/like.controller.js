import LIkeRepository from "./like.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LIkeRepository();
  }

  async getLikes(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ success: false, msg: "ID is required." });
      }

      const likes = await this.likeRepository.getLikes(id);

      if (likes.success) {
        res.status(201).json({ success: true, res: likes.res });
      } else {
        res.status(500).json({ success: false, res: "Failed to toggle like." });
      }
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const { userId } = req;
      const { type } = req.query;
      const { id } = req.params;

      if (!type || !id) {
        return res
          .status(400)
          .json({ success: false, msg: "type and ID is required." });
      }

      const like = await this.likeRepository.toggleLike(userId, id, type);

      if (like.success) {
        res.status(201).json({ success: true, res: like.res });
      } else {
        res.status(500).json({ success: false, res: "Failed to toggle like." });
      }
    } catch (error) {
      next(error);
    }
  }
}
