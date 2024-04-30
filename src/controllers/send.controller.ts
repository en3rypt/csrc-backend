import { Request, Response } from "express";

export default class SendController {
  public send = async (req: Request, res: Response) => {
    try {
      res.status(200).send("Message sent ");
    } catch (err) {
      console.error("Error sending message: ", err);
      res.status(500).send("Error sending message");
    }
  };
}
