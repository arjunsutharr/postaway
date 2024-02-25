import express from "express";
import PostController from "./post.controller.js";
import upload from "../../middlewares/fileUpload.middleware.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

const router = express.Router();
const postController = new PostController();

//Retrieve a specific post by ID.
router.get("/:postId", (req, res, next) => {
  postController.signUp(req, res, next);
});

//Retrieve all posts for a specific user to display on their profile page.
router.get("/", (req, res, next) => {
  postController.signIn(req, res, next);
});

// Create a new post.
router.post("/", jwtAuth, upload.single("imageUrl"), (req, res, next) => {
  postController.createPost(req, res, next);
});

// Update a specific post.
router.put("/:postId", jwtAuth, (req, res, next) => {
  postController.logoutAll(req, res, next);
});

//Delete a specific post.
router.delete("/:postId", jwtAuth, (req, res, next) => {
  postController.logoutAll(req, res, next);
});

//Retrieve all posts from various users to compile a news feed.
// router.get("/all", jwtAuth, (req, res, next) => {
//   postController.logoutAll(req, res, next);
// });

export default router;
