import { Hono } from 'hono';
import { authRoutes } from './infrastructure/http/hono/routes/auth';
import { bootstrapDatabase } from './infrastructure/database/config/mysql';
import { serve } from 'bun';

const PORT = Number(process.env.PORT)

const app = new Hono();

(async () => {
  // Space to lanche setup or config functions
  bootstrapDatabase()
})();

app.route('/auth', authRoutes);

serve({
  fetch: app.fetch,
  port: PORT || 3000,
})

export default app;