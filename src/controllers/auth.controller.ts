import { EmailService } from "../services/email.service";
import JWTHelper from "../utils/jwt.util";
import redisClient from "../utils/redis";
import { Request, Response } from "express";
const emailService = new EmailService();
export default class AuthController {
  private jwtHelper;
  constructor() {
    this.jwtHelper = new JWTHelper();
  }
  public sendVerify = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).send("Email is required");
      }
      const token = this.jwtHelper.generateAuthToken(email);
      await emailService.sendEmail(
        process.env.ADMIN_EMAIL ?? "",
        "Email Verification",
        `Click <a href="${process.env.BASE_URL}/verify-email?token=${token}">here</a> to verify your email. The link will expire in 10 minutes.`
      );
      redisClient.setValue(token, email, 600);
      res
        .status(200)
        .send(
          "Please check your email for verification link. The link will expire in 10 mintues."
        );
    } catch (err) {
      console.error("Error sending message: ", err);
      res.status(500).send("Error sending message");
    }
  };

  public verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).send("Token are required");
      }
      const storedEmail = await redisClient.getValue(token as string);

      const decodedToken = this.jwtHelper.verifyAuthToken(token as string);

      if (
        !decodedToken ||
        typeof decodedToken !== "object" ||
        !storedEmail ||
        decodedToken.email !== storedEmail
      ) {
        return res.status(401).send("Invalid token");
      }
      redisClient.setValue(storedEmail, "verified");
      res.status(200).send("Email verified");
    } catch (err) {
      console.error("Error verifying email: ", err);
      res.status(500).send("Error verifying email");
    }
  };
}
