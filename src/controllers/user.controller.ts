import { Request, Response } from "express";
import redisClient from "../utils/redis";
import { DBService } from "../services/db.service";
import { MinioService } from "../services/minio.service";
import { UserService } from "../services/user.service";
import { EmailService } from "../services/email.service";

const userService = new UserService();
const dbService = new DBService();
const minioService = new MinioService();
const emailService = new EmailService();
export default class UserController {
  public send = async (req: Request, res: Response) => {
    try {
      const { name, phone, email, subject, message } = req.body;
      //check if email is verified
      const isEmailVerified = await redisClient.getValue(email);
      if (isEmailVerified !== "verified") {
        return res.status(401).send("Email is not verified");
      }
      const file = req.file?.buffer.toString("base64");
      const resp = await userService.sendContactFormSubmission(
        name,
        phone,
        email,
        subject,
        message,
        file
      );

      let emailResp = "";
      if (resp !== "") {
        emailResp = `Name: ${name}<br>Phone: ${phone}<br>Email: ${email}<br>Subject: ${subject}<br>Message: ${message}<br>File: <a href="${process.env.BASE_URL}/submission/file/${resp}">Download</a>`;
      } else {
        emailResp = `Name: ${name}<br>Phone: ${phone}<br>Email: ${email}<br>Subject: ${subject}<br>Message: ${message}`;
      }

      await emailService.sendEmail(
        process.env.ADMIN_EMAIL ?? "",
        "New Contact Form Submission",
        emailResp
      );

      res.status(200).send("Message submitted successfully");
    } catch (err) {
      console.error("Error sending message: ", err);
      res.status(500).send("Error sending message");
    }
  };

  async getAllSubmissions(req: Request, res: Response) {
    try {
      const submissions = await userService.getContactFormSubmissions();
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
      const submissions = await dbService.getContactFormSubmissionsByEmail(
        email as string
      );
      res.status(200).send(submissions);
    } catch (err) {
      console.error("Error getting messages: ", err);
      res.status(500).send("Error getting messages");
    }
  }

  async downloadSubmissionByFilename(req: Request, res: Response) {
    try {
      let { fileName } = req.params;
      if (!fileName) {
        return res.status(400).send("Filename is required");
      }
      const file = await minioService.getFile(fileName);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", "application/pdf");
      res.status(200).send(file);
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

      const submission = await dbService.getContactFormSubmissionByUUID(uuid);
      if (!submission) {
        return res.status(404).send("Submission not found");
      }
      if (!submission.fileURL) {
        return res.status(404).send("Submission does not have a file");
      }
      const fileName: string = submission.fileURL.split("/").pop() ?? "";
      const file = await minioService.getFile(fileName);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", "application/pdf");
      res.status(200).send(file);
    } catch (err) {
      console.error("Error getting messages: ", err);
      res.status(500).send("Error getting messages");
    }
  }
}
