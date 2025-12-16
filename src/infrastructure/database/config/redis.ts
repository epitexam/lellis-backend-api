import { RedisClient } from "bun";

/**
 * Redis connection configuration based on environment variables.
 *
 * IMPORTANT NOTE: When running the Bun application on the host machine,
 * it connects to Redis through the port exposed by Docker (localhost:6379),
 * unless REDIS_URL is explicitly set in the .env file (e.g., for remote environments).
 */
const redisConfig = {
  url: process.env.REDIS_URL || "redis://localhost:6379",
};

let redisClient: RedisClient | null = null;

/**
 * Returns a singleton instance of the Redis client.
 *
 * This function ensures only one RedisClient instance is created throughout
 * the application's lifecycle. It also configures reconnection behavior and
 * event listeners for connection status logging.
 *
 * @returns {RedisClient} The singleton Redis client instance.
 */
export function getRedisClient(): RedisClient {
  if (redisClient) {
    return redisClient;
  }

  redisClient = new RedisClient(redisConfig.url, {
    autoReconnect: true,
    maxRetries: 10,
    connectionTimeout: 10000,
    enableOfflineQueue: true,
  });

  redisClient.onconnect = () => {
    console.log(`[Redis] Successfully connected to ${redisConfig.url}`);
  };

  redisClient.onclose = (error?: any) => {
    if (error) {
      console.error("[Redis] Connection lost due to error:", error);
    } else {
      console.log("[Redis] Connection closed gracefully.");
    }
  };

  return redisClient;
}

/**
 * Initializes the Redis connection with retry logic and performs a health check.
 *
 * Attempts to connect to Redis, pings the server, and executes a simple set/get/delete
 * operation to verify full functionality. Retries up to a maximum number of attempts
 * with exponential backoff-like delays.
 *
 * @throws {Error} If Redis cannot be reached after all retry attempts.
 */
export async function initializeRedis(): Promise<void> {
  const maxAttempts = 5;
  const delayMs = 3000;

  const client = getRedisClient();
  console.log(`[Redis] Attempting to connect to ${redisConfig.url}...`);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.ping();

      const testKey = "system:redis:healthcheck";
      await client.set(testKey, "operational");
      const value = await client.get(testKey);

      if (value === "operational") {
        await client.del(testKey);
        console.log("[Redis] Redis is fully operational and responsive.");
        return;
      }
    } catch (error: any) {
      console.error(
        `[Redis] Attempt ${attempt}/${maxAttempts} failed: ${error.code || error.message || error
        }`
      );

      if (attempt === maxAttempts) {
        const finalError = new Error(
          "Redis initialization failed: Unable to establish a working connection after multiple attempts."
        );
        console.error(`[Redis] Giving up after ${maxAttempts} attempts.`);
        throw finalError;
      }

      console.log(
        `[Redis] Redis not ready yet. Retrying in ${delayMs / 1000} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

/**
 * Gracefully closes the Redis client connection.
 *
 * Should be called during application shutdown (e.g., in SIGINT/SIGTERM handlers)
 * to ensure proper cleanup and avoid abrupt disconnections.
 */
export function closeRedisClient(): void {
  if (redisClient) {
    console.log("[Redis] Closing Redis client connection...");
    redisClient.close();
    redisClient = null;
  }
}