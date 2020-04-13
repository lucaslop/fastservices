import Appointments from "../models/Appointments";
import { startOfDay, endOfDay } from "date-fns";
import { Op } from "sequelize";

class AvaliableController {
  async index(req, res) {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Data invalida" });
    }
    const schearDate = parseInt(date);
    const appointments = await Appointments.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(schearDate), endOfDay(schearDate)]
        }
      }
    });
    const schedule = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
      "24:00"
    ];
    const avaliabe = schedule.map(time => {
      //pego as horas e depois os minutos usando a desestruturação
      const [hour, minute] = time.split(":");
      //
      const value = setSeconds(
        setMinutes(setHours(schearDate, hour), minute),
        0
      );
      return {
        time,
        value: format(value, "yyy-MM-dd'T'HH:mm:ssxxx"),
        avaliabe:
          isAfter(value, new Date()) &&
          !appointments.find(
            appointments => format(appointments.date, "HH:mm") === time
          )
      };
    });
    return res.json(avaliabe);
  }
}

export default new AvaliableController();
