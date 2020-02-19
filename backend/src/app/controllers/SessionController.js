import jwt from "jsonwebtoken";
import User from "../models/User";
import authconfig from "../../config/auth";
class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      res.status(401).json({ error: "usuario não encontrado" });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: "senha errada" });
    }

    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        token: jwt.sign({ id }, authconfig.secret, {
          expiresIn: authconfig.expiresIn
        })
      }
    });
  }
}
export default new SessionController();
