import { Hono } from 'hono'
import { AuthMiddleware } from './infrastructure/http/hono/middlewares/jwt'
import { HonoJwtService } from './infrastructure/security/HonoJwtService'

const jwtService = new HonoJwtService(process.env.SECRET || "", 3600, Number(process.env.DAYS) || 7)
const authMiddlewareInstance = new AuthMiddleware(jwtService)
export const authGuard = authMiddlewareInstance.createMiddleware()

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
