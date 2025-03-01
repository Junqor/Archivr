import multer from "multer";
import { tmpDir } from "../utils/tmpDir.js";

export const fileUploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, tmpDir.name);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedMimes = [
      "image/jpeg",
      "image/bmp",
      "image/png",
      "image/tiff",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only jpg, png and webp image files are allowed."
        )
      );
    }
  },
  limits: {
    files: 1,
    fileSize: 1024 * 1024,
  },
});
