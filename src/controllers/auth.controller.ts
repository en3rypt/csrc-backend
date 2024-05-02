import JWTHelper from "../utils/jwt.util";
import redisClient from "../utils/redis";
import { Request, Response } from "express";
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
      redisClient.setValue(token, email);
      res.status(200).send("Please check your email for verification link");
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
      res.status(200).send("Email verified");
    } catch (err) {
      console.error("Error verifying email: ", err);
      res.status(500).send("Error verifying email");
    }
  };
}
