import jwt from "jsonwebtoken";
import User from "../models/User";
import authconfig from "../../config/auth";
import * as Yup from "yup";
class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "erro de validação" });
    }

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
