import User from "../../app/models/User";

class UserController {
  async store(req, res) {
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
