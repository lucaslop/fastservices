import Appointments from "../models/Appointments";
import File from "../models/File";
import User from "../models/User";
import { startOfHour, parseISO, isBefore } from "date-fns";
import User from "../models/User";
import * as Yup from "yup";
class AppointmentsController {
  //mostrando agendamentos do usuario
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointments.findAll({
      where: {
        id: req.userId,
        canceled_at: null
      },
      order: ["date"],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ["id", "date"],
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            {
              model: File,
              attributes: ["id", "url", "path"]
            }
          ]
        }
      ]
    });

    return res.json(appointments);
  }
  //cadastro de agendamento
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

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Horario invalido" });
    }

    const checkAvaliabity = await Appointments.findAll({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvaliabity) {
      return res.status(400).json({ error: "Horario já marcado" });
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
