import mongoose from "mongoose";
import { CustomErrorHandler } from "../error-handler/errorHandler.js";

const baseUrl = process.env.DB_URL || "mongodb://0.0.0.0:27017/postway";

export const connectToMongoDb = async () => {
  try {
    await mongoose.connect(baseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected using mongoose");
  } catch (error) {
    throw new CustomErrorHandler(400, error);
  }
};
