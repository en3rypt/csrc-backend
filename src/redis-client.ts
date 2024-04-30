import { Redis } from "ioredis";

let redisClient: Redis;

const connectRedis = async () => {
  redisClient = new Redis(process.env.REDIS_URL || "http://localhost:6379");

  redisClient.on("error", (err) => {
    console.error("Redis connection error: ", err);
  });

  // No need to manually connect with ioredis
  console.log("Connected to Redis");
  return redisClient;
};

const getRedisClient = async () => {
  if (!redisClient || redisClient.status !== "ready") {
    return await connectRedis();
  }
  return redisClient;
};

export default getRedisClient;
