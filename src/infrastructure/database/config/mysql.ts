import { SQL } from "bun";

/**
 * Database configuration object with environment variables and defaults.
 */
const dbConfig = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "app_user",
  password: process.env.DB_PASSWORD || "app_password",
  database: process.env.DB_NAME || "app_db",
  connectionLimit: process.env.DB_CONNECTION_LIMIT || "10"
};

/**
 * Construct the connection string dynamically.
 * connectionLimit is crucial to prevent "Too many connections" during hot reloads.
 */
const connectionString = `mysql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?connectionLimit=${dbConfig.connectionLimit}`;

/**
 * Database instance using Bun's native SQL runtime.
 */
export const db = new SQL(connectionString);

/**
 * Properly closes the database connection pool.
 */
export async function closeDatabase(): Promise<void> {
  try {
    console.log("[Database] Closing connection pool...");
    await db.close();
    console.log("[Database] Connection pool closed.");
  } catch (error) {
    console.error("[Database] Error while closing pool:", error);
  }
}

/**
 * Internal schema synchronization.
 */
async function setupDatabase(): Promise<void> {
  const maxAttempts = 5;
  const delay = 3000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await db`SELECT 1`;

      await db`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          mfa_enabled TINYINT(1) DEFAULT 0,
          last_login DATETIME(3) NULL,
          status VARCHAR(20) NOT NULL,
          created_at DATETIME(3) NOT NULL,
          updated_at DATETIME(3) NOT NULL,
          INDEX idx_user_email (email),
          INDEX idx_user_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;

      console.log("MySQL initialized and tables ready.");
      return;
    } catch (error: any) {
      if (attempt === maxAttempts) throw error;
      console.log(`[Database] Waiting for MySQL... (Attempt ${attempt}/${maxAttempts})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Monitors connection health.
 */
function monitorConnections(intervalMs: number): void {
  setInterval(async () => {
    try {
      const stats = await db<{ Variable_name: string; Value: string }[]>`
        SHOW STATUS WHERE Variable_name IN ('Threads_connected', 'Max_used_connections')
      `;

      const current = parseInt(stats.find(s => s.Variable_name === 'Threads_connected')?.Value || "0");
      const peak = parseInt(stats.find(s => s.Variable_name === 'Max_used_connections')?.Value || "0");
      const limit = parseInt(dbConfig.connectionLimit);
      
      const usagePercent = ((current / limit) * 100).toFixed(1);
      const timestamp = new Date().toLocaleTimeString();

      console.log(`\n--- DATABASE HEALTH CHECK [${timestamp}] ---`);
      console.log(`Target DB: ${dbConfig.database} | Host: ${dbConfig.host}`);
      console.log(`Active Connections: ${current} / ${limit} (${usagePercent}% of App Pool)`);
      console.log(`Description: Current active pipes between this Bun instance and MySQL.`);
      
      console.log(`Global Server Peak: ${peak}`);
      console.log(`Description: Max concurrent connections recorded since MySQL started.`);

      if (current >= limit * 0.8) {
        console.warn(`CRITICAL: Pool is almost full! (${usagePercent}% used)`);
      } else if (current > 0) {
        console.log(`Status: Healthy (Connection pool is stable)`);
      }
      console.log("-----------------------------------------------\n");

    } catch (e) {
      console.error(`\n[DB Monitor] ALERT [${new Date().toLocaleTimeString()}]: Connection lost or server unreachable.`);
    }
  }, intervalMs);
}

/**
 * BOOTSTRAP: Initializes connection, schema, monitoring and shutdown handlers.
 */
export async function bootstrapDatabase(): Promise<void> {
  try {
    console.log(`Connecting to database ${dbConfig.database} on ${dbConfig.host}...`);
    await setupDatabase();
    monitorConnections(2000);

    const handleShutdown = async () => {
      await closeDatabase();
      process.exit(0);
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);

  } catch (error) {
    console.error("Critical failure during database bootstrap:", error);
    process.exit(1);
  }
}