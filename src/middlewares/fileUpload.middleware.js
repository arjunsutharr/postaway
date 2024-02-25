import multer from "multer";
import path from "path";
import { CustomErrorHandler } from "../error-handler/errorHandler.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filePath = path.join("uploads");
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const filename =
      new Date().toISOString().replace(/:/g, "_") + file.originalname;
    cb(null, filename);
  },
});

export const upload = multer({ storage });

// limits: { fileSize: 1024 * 1024 * 2 },
// fileFilter: (req, file, cb) => {
//   const allowedMimes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
//   if (allowedMimes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new CustomErrorHandler(
//         400,
//         "Invalid file type. Only jpeg,jpg,png,gif types are allowed and maximum file size 2mb"
//       )
//     );
//   }
// },

export default upload;
