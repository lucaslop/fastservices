import Appointments from "../models/Appointments";
import File from "../models/File";
import User from "../models/User";
import { startOfHour, parseISO, isBefore, format, subHours } from "date-fns";
import User from "../models/User";
import Notification from "../schema/Notification";
import pt from "date-fns/locale/pt";
import * as Yup from "yup";
import Mail from "../../lib/Mail";
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
      provider_id: Yup.number().required(),
      date: Yup.date().required()
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

    const checkAvaliabity = await Appointments.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    });

    if (checkAvaliabity) {
      return res.status(400).json({ error: "horario já marcado" });
    }
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      {
        locate: pt
      }
    );
    await Notification.create({
      content: `Novo agendamento de : ${user.name} para o ${formattedDate}  `,
      user: provider_id
    });

    const appointment = await Appointments.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }
  async delete(req, res) {
    const appointment = await Appointments.findByPk(req.params.id);
    if (appointment.user_id != req.userId) {
      return res
        .status(400)
        .json({ error: "Somente o dono pode excluir este agendamento" });
    }

    const subWithSub = subHours(appointment.date, 2);
    if (isBefore(subWithSub, new Date())) {
      return res.status(401).json({
        error: "Você só pode cancelar agendamentos em até duas horas antes"
      });
    }

    appointment.canceled_at = new Date();
    await appointment.save();
    const provider = await User.findByPk(appointment.provider_id);
    await Mail.sendEmail({
      to: `${provider.name} <${provider.email}>`,
      subject: "Agendamento Cancelado",
      text: "você tem um novo cancelamento"
    });

    return res.json(appointment);
  }
}

export default new AppointmentsController();
