import { Request, Response } from "express";
import redisClient from "../utils/redis";

export default class SendController {
  public send = async (req: Request, res: Response) => {
    try {
      redisClient.setValue("message", "req.body.message");
      res.status(200).send("Message sent ");
    } catch (err) {
      console.error("Error sending message: ", err);
      res.status(500).send("Error sending message");
    }
  };

  public get = async (req: Request, res: Response) => {
    try {
      const val = await redisClient.getValue("message");
      res.status(200).send(val);
    } catch (err) {
      console.error("Error sending message: ", err);
      res.status(500).send("Error sending message");
    }
  };
}
