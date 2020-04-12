import User from "../models/User";
import * as Yup from "yup";

class UserController {
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

    const userExists = await User.findOne({
      where: { email: req.body.email }
    });
    if (userExists) {
      return res.status(400).json({ error: "existe" });
    }

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider
    });
  }
  async up(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassowrd", (oldPassword, field) => {
          return oldPassword ? field.require() : field;
        }),

      confirmPassword: Yup.string().when("password", (password, field) => {
        return password ? field.required().oneOf([Yup.ref("password")]) : field;
      })
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "erro de validação" });
    }

    const user = await User.findByPk(req.userId);

    const { email, oldPassword } = req.body;

    if (email) {
      if (user.email != email) {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
          return res.status(400).json({ error: "existe este email" });
        }
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const { name, provider } = await user.update(req.body);
    return res.json({
      user: {
        email,
        name,
        provider
      }
    });
  }
}

export default new UserController();
