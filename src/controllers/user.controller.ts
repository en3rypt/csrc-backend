import { Request, Response } from "express";
import redisClient from "../utils/redis";
import { DBService } from "../services/db.service";
import { MinioService } from "../services/minio.service";
import { UserService } from "../services/user.service";

export default class UserController {
  private readonly bucketName;
  private readonly dbService;
  private readonly minioService;
  private readonly userService;
  constructor() {
    this.bucketName = process.env.MINIO_BUCKET_NAME ?? "local-submissions";
    this.dbService = new DBService();
    this.minioService = new MinioService();
    this.userService = new UserService();
  }
  public send = async (req: Request, res: Response) => {
    try {
      const { name, phone, email, subject, message, file } = req.body;
      const resp = await this.userService.sendContactFormSubmission(
        name,
        phone,
        email,
        subject,
        message,
        file
      );
      res.status(200).send(resp);
    } catch (err) {
      console.error("Error sending message: ", err);
      res.status(500).send("Error sending message");
    }
  };

  async getAllSubmissions(req: Request, res: Response) {
    try {
      const submissions = await this.userService.getContactFormSubmissions();
      res.status(200).send(submissions);
    } catch (err) {
      console.error("Error getting messages: ", err);
      res.status(500).send("Error getting messages");
    }
  }

  async getSubmissionsByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).send("Email is required");
      }
      const submissions = await this.dbService.getContactFormSubmissionsByEmail(
        email as string
      );
      res.status(200).send(submissions);
    } catch (err) {
      console.error("Error getting messages: ", err);
      res.status(500).send("Error getting messages");
    }
  }

  async downloadSubmissionFileByUUID(req: Request, res: Response) {
    try {
      let { uuid } = req.params;
      if (!uuid) {
        return res.status(400).send("ID is required");
      }

      const submission = await this.dbService.getContactFormSubmissionByUUID(
        uuid
      );
      if (!submission) {
        return res.status(404).send("Submission not found");
      }
      if (!submission.fileURL) {
        return res.status(404).send("Submission does not have a file");
      }
      const file = await this.minioService.getFile(submission.fileURL);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${submission.fileURL}`
      );
      res.setHeader("Content-Type", "application/pdf");
      res.send(file);
    } catch (err) {
      console.error("Error getting messages: ", err);
      res.status(500).send("Error getting messages");
    }
  }
}
