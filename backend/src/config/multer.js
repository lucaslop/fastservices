import multer from "multer";
import { resolve, extname } from "path";
import crypto from "crypto";
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
