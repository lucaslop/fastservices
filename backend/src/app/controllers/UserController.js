import User from "../../app/models/User";
import * as Yup from "yup";
import { Field } from "pg-packet-stream/dist/messages";

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

    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist) {
      return res.status(400).json({ error: "Usuario já cadastrado" });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider
    });
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) => {
          return oldPassword ? field.require() : field;
        }),
      confirmPassword: Yup.string().when("password", (password, field) => {
        return password ? field.required().oneOf([Yup.ref("password")]) : field;
      })
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "erro de validação" });
    }
    const user = User.findByPk(req.userId);
    const { email, oldPassword } = req.body;

    if (email != user.email) {
      const existEmail = User.findOne({ where: { email: email } });

      if (existEmail) {
        return res.json("email já cadastrado");
      }

      user.email = email;
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const { name, provider } = req.body;
    return res.json({
      user: {
        name,
        email,
        provider
      }
    });
  }
}

export default new UserController();
