import axios from "axios";

export class EmailService {
  private readonly mailServer;
  constructor() {
    this.mailServer = axios.create({
      baseURL: process.env.MAILSERVER_BASE_URL,
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    const response = await this.mailServer.post("/api/send", {
      to,
      subject,
      html,
    });
    return response.status == 200;
  }
}
