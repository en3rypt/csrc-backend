import Redis from "ioredis";
import config from "../config";
class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.redis);
  }

  async getValue(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async setValue(key: string, value: string, expiry = 86400): Promise<void> {
    await this.client.set(key, value, "EX", expiry);
  }
}

export default new RedisClient();
