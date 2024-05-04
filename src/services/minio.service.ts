import { Client } from "minio";
import config from "../config";

const minioClient: Client = new Client(config.minioConfig);
const bucketName: string = process.env.MINIO_BUCKET_NAME ?? "local-bucket";

export class MinioService {
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
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName, "india");
    }

    await minioClient.putObject(
      bucketName,
      fileName,
      fileBuffer,
      contentLength,
      { "Content-Type": contentType }
    );
  }

  public async getFile(fileName: string) {
    // return await minioClient.getObject(bucketName, fileName);
    try {
      const dataStream = await minioClient.getObject(bucketName, fileName);
      return await this.streamToBuffer(dataStream);
    } catch (error) {
      console.error("Error retrieving file from Minio:", error);
      throw error;
    }
  }

  public async removeFile(bucketName: string, fileName: string) {
    await minioClient.removeObject(bucketName, fileName);
  }

  public async generatePresignedUrl(
    bucketName: string,
    fileName: string,
    expiry: number
  ) {
    return await minioClient.presignedGetObject(bucketName, fileName, expiry);
  }

  public async listObjects(bucketName: string) {
    return await minioClient.listObjects(bucketName);
  }

  public async listBuckets() {
    return await minioClient.listBuckets();
  }

  public async removeBucket(bucketName: string) {
    return await minioClient.removeBucket(bucketName);
  }

  public async makeBucket(bucketName: string) {
    return await minioClient.makeBucket(bucketName);
  }

  public async bucketExists(bucketName: string) {
    return await minioClient.bucketExists(bucketName);
  }
}
