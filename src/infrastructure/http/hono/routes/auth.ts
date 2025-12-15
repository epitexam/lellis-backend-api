import { Hono } from "hono";
import { CreateUserComposer } from "../../../services/user/CreateUserComposer";
import { LoginComposer } from "../../../services/auth/LoginComposer";

export const authRoutes = new Hono()

authRoutes.post('/register', (c) => {
    const controller = CreateUserComposer();
    const data = controller.handle(c);
    return data
})

authRoutes.post('/login', (c) => {
    const controller = LoginComposer();
    const udata = controller.handle(c);
    return udata
})

authRoutes.get('/help', (c) => {
    return c.json({
        message: "no help for now."
    })
})