import nodemailer from "nodemailer";
import nodemailerConfig from "../config/mail";
class Mail {
  constructor() {
    const { host, port, secure, auth } = nodemailerConfig;
    this.transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: auth.user ? auth : null
    });
  }
  sendEmail(message) {
    return this.transporter.sendMail({
      ...nodemailerConfig.default,
      ...message
    });
  }
}
export default new Mail();
