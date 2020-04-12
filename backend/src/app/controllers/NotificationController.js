import User from "../models/User";
import Notification from "../schema/Notification";
class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    });
    if (!isProvider) {
      return res.status(400).json({ error: "Você não tem acesso" });
    }

    const notifications = await Notification.find({
      user: req.userId
    })
      .sort({ createdAt: "desc" })
      .limit(20);

    return res.json(notifications);
  }
  async update(req, res) {
    const notifcation = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    return res.json(notifcation);
  }
}

export default new NotificationController();
