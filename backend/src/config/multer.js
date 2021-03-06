import multer from "multer";
import crypto from "crypto";
import { resolve, extname } from "path";

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "tmp", "uploads"),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, response) => {
        if (err) {
          return cb(err);
        }
        return cb(null, response.toString("hex") + extname(file.originalname));
      });
    }
  })
};
