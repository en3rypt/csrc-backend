export default {
  redis: {
    url: process.env.REDIS_URL || "redis://redis:6379",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    host: process.env.REDIS_HOST || "redis",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "test-secret-key",
  },
  minioConfig: {
    region: process.env.MINIO_REGION || "auto",
    endPoint: process.env.MINIO_ENDPOINT || "localhost:9000",
    port: parseInt(process.env.MINIO_PORT || "9000"),
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ROOT_USER || "minio",
    secretKey: process.env.MINIO_SECRET_PASSWORD || "minio123",
  },
};
