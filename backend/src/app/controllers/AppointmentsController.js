import Appointments from "../models/Appointments";
import User from "../models/User";
import * as Yup from "yup";
class AppointmentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required()
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "erro de validação" });
    }
    const { provider_id, date } = req.body;
    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true
      }
    });
    if (!isProvider) {
      return res
        .status(400)
        .json({ error: "Só é possivel agendar com prestadores de serviço" });
    }

    const appointment = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }
}

export default new AppointmentsController();
