export default {
  redis: {
    url: process.env.REDIS_URL || "redis://redis:6379",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    host: process.env.REDIS_HOST || "redis",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "test-secret-key",
  },
};
