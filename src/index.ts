import { Hono } from 'hono';
import { AuthMiddleware } from './infrastructure/http/hono/middlewares/jwt';
import { HonoJwtService } from './infrastructure/security/HonoJwtService';
import { authRoutes } from './infrastructure/http/hono/routes/auth';
import { bootstrapDatabase } from './infrastructure/database/config/mysql';

const jwtService = new HonoJwtService(process.env.SECRET || "a_very_long_and_secure_secret_at_least_32_chars", 3600, Number(process.env.DAYS) || 7);
const authMiddlewareInstance = new AuthMiddleware(jwtService);
export const authGuard = authMiddlewareInstance.createMiddleware();

const app = new Hono();

(async () => {
  // Space to lanche setup or config function
  bootstrapDatabase()
})();

app.route('/auth', authRoutes);

export default app;