import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import { loggerMiddleware } from "./src/middlewares/logger.middleware.js";
import { appLevelErrorHandlerMiddleware } from "./src/error-handler/errorHandler.js";
import { invalidRoutesHandlerMiddleware } from "./src/middlewares/invalidRoutesHandlerMiddleware.js";
import { connectToMongoDb } from "./src/config/mongoDB.js";
import userRouter from "./src/features/user/user.routes.js";
import postRouter from "./src/features/post/post.routes.js";
import commentRouter from "./src/features/comment/comment.routes.js";
import likeRouter from "./src/features/like/like.routes.js";
import friendRouter from "./src/features/friends/friends.routes.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

// For client req logging
app.use(loggerMiddleware);

app.use("/api/friends", friendRouter); //friend Routes
app.use("/api/likes", likeRouter); //Like Routes
app.use("/api/comments", commentRouter); //Comment Routes
app.use("/api/posts", postRouter); //Post Routes
app.use("/api/users", userRouter); //User Routes

// Default request handler
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Postaway apis");
});

// error handler middlerware
app.use(appLevelErrorHandlerMiddleware);

// Invalid routes/404 requests handler middleware
app.use(invalidRoutesHandlerMiddleware);

app.listen(8000, () => {
  console.log("Server is running at port 8000");
  connectToMongoDb();
});
