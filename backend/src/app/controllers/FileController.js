import File from "../models/File";
class FileController {
  async store(req, res) {
    const { filename, originalname } = req.file;
    const file = await File.create({
      name: originalname,
      path: filename
    });
    return res.json(file);
  }
}

export default new FileController();
