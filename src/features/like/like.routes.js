import express from "express";
// import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwtAuth.middleware.js";

const router = express.Router();
// const userController = new UserController();

// Authentication Routes

// router.post("/signup", (req, res, next) => {
//   userController.signUp(req, res, next);
// });

// router.post("/signin", (req, res, next) => {
//   userController.signIn(req, res, next);
// });

// router.get("/logout", jwtAuth, (req, res, next) => {
//   userController.logout(req, res, next);
// });

// router.get("/logout-all-devices", jwtAuth, (req, res, next) => {
//   userController.logoutAll(req, res, next);
// });

// //User Profile Routes
// router.get("/get-details/:userId", jwtAuth, (req, res, next) => {
//   userController.get(req, res, next);
// });

// router.get("/get-all-details", jwtAuth, (req, res, next) => {
//   userController.getAll(req, res, next);
// });

// router.put("/update-details/:userId", jwtAuth, (req, res, next) => {
//   userController.update(req, res, next);
// });

export default router;
