import { DBService } from "./db.service";
import { MinioService } from "./minio.service";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  private readonly bucketName;
  private readonly dbService;
  private readonly minioService;
  constructor() {
    this.bucketName = process.env.MINIO_BUCKET_NAME ?? "local-submissions";
    this.dbService = new DBService();
    this.minioService = new MinioService();
  }

  public async sendContactFormSubmission(
    name: string,
    phone: string,
    email: string,
    subject: string,
    message: string,
    file: string
  ) {
    try {
      let fileURL = "";
      if (!name || !phone || !email || !subject || !message) {
        throw new Error("All fields are required");
      }
      if (file) {
        const fileName = `${email}-${Date.now()}.pdf`;
        const fileBuffer = Buffer.from(file, "base64");
        await this.minioService.uploadFile(
          fileName,
          fileBuffer,
          fileBuffer.length,
          "application/pdf"
        );
        fileURL = `http://minio:9000/${this.bucketName}/${fileName}`;
      }
      const uuid = uuidv4();
      await this.dbService.createContactFormSubmission({
        uuid,
        name,
        phone,
        email,
        subject,
        message,
        fileURL,
      });
      return "Message Successfully Sent";
    } catch (err) {
      console.error("Error sending message: ", err);
      throw new Error("Error sending message");
    }
  }

  public async getContactFormSubmissions() {
    try {
      return await this.dbService.getAllContactFormSubmissions();
    } catch (err) {
      console.error("Error getting messages: ", err);
      throw new Error("Error getting messages");
    }
  }

  public async getContactFormSubmissionsByEmail(email: string) {
    try {
      return await this.dbService.getContactFormSubmissionsByEmail(email);
    } catch (err) {
      console.error("Error getting messages: ", err);
      throw new Error("Error getting messages");
    }
  }
}
