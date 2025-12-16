import { Hono } from "hono";
import { CreateUserComposer } from "../../../services/user/CreateUserComposer";
import { LoginComposer } from "../../../services/auth/LoginComposer";
import { RefreshTokenComposer } from "../../../services/auth/RefreshTokenComposer";

export const authRoutes = new Hono()

authRoutes.post('/register', (c) => {
    const controller = CreateUserComposer();
    const data = controller.handle(c);
    return data
})

authRoutes.post('/login', (c) => {
    const controller = LoginComposer();
    const data = controller.handle(c);
    return data
})

authRoutes.post('/refresh', (c) => {
    const controller = RefreshTokenComposer()
    const data = controller.handle(c);
    return data
})

authRoutes.get('/help', (c) => {
    return c.json({
        message: "no help for now."
    })
})