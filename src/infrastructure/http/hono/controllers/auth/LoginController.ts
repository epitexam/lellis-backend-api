import { Context } from "hono";
import { LogInUseCase } from "../../../../../application/usecases/auth/LogInUseCase";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { HttpStatusCodes } from "../../../../../application/interfaces/HttpStatusCodes";
import { DomainError } from "../../../../../application/interfaces/IDomainError";
import { LoginUserDTO } from "../../../../../domain/user/dtos/LoginUserDTO";

export class LoginController {

    constructor(
        private readonly loginUseCase: LogInUseCase
    ) { }

    async handle(c: Context) {
        try {
            const { email, password }: LoginUserDTO = await c.req.json()

            const tokens = await this.loginUseCase.execute({ email, password })

            return c.json(tokens, HttpStatusCodes.OK)

        } catch (error: any) {

            if (error instanceof DomainError) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode)
            }

            return c.json({ message: error.message || "Internal server error" }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}
