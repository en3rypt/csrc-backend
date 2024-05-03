import { Client } from "minio";
import config from "../config";

export class MinioService {
  private readonly minioClient: Client;
  private readonly bucketName: string;
  constructor() {
    this.minioClient = new Client(config.minioConfig);
    this.bucketName = process.env.MINIO_BUCKET_NAME ?? "local-bucket";
  }

  private async streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on("data", (chunk: any) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    contentLength: number,
    contentType: string
  ) {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, "india");
    }

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      fileBuffer,
      contentLength,
      { "Content-Type": contentType }
    );
  }

  public async getFile(fileName: string) {
    // return await this.minioClient.getObject(this.bucketName, fileName);
    try {
      const dataStream = await this.minioClient.getObject(
        this.bucketName,
        fileName
      );
      return await this.streamToBuffer(dataStream);
    } catch (error) {
      console.error("Error retrieving file from Minio:", error);
      throw error;
    }
  }

  public async removeFile(bucketName: string, fileName: string) {
    await this.minioClient.removeObject(bucketName, fileName);
  }

  public async generatePresignedUrl(
    bucketName: string,
    fileName: string,
    expiry: number
  ) {
    return await this.minioClient.presignedGetObject(
      bucketName,
      fileName,
      expiry
    );
  }

  public async listObjects(bucketName: string) {
    return await this.minioClient.listObjects(bucketName);
  }

  public async listBuckets() {
    return await this.minioClient.listBuckets();
  }

  public async removeBucket(bucketName: string) {
    return await this.minioClient.removeBucket(bucketName);
  }

  public async makeBucket(bucketName: string) {
    return await this.minioClient.makeBucket(bucketName);
  }

  public async bucketExists(bucketName: string) {
    return await this.minioClient.bucketExists(bucketName);
  }
}
