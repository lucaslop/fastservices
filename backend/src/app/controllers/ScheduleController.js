import User from "../models/User";
import Appointment from "../models/Appointments";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Op } from "sequelize";
class ScheduleController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    });
    if (!isProvider) {
      return res.status(400).json({ error: "Você naão tem permissão" });
    }
    const { date } = req.query;
    const parsedDate = parseISO(date);
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },

      order: ["date"]
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
