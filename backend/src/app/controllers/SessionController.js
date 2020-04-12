import User from "../models/User";
import jwt from "jsonwebtoken";
import auth from "../../config/auth";
import * as Yup from "yup";
class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "erro de validação" });
    }

    const { password, email } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ error: "Usuario não existe" });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: "senha incorreta" });
    }
    const { id, name } = user;
    return res.json({
      user: {
        id,
        name,
        email,
        token: jwt.sign({ id }, auth.secret, {
          expiresIn: auth.expiresIn
        })
      }
    });
  }
}

export default new SessionController();
