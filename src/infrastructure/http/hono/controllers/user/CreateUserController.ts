import { Context } from "hono";
import { DomainError } from "../../../../../application/interfaces/IDomainError";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { HttpStatusCodes } from "../../../../../application/interfaces/HttpStatusCodes";
import { CreateUserDTO } from "../../../../../domain/user/dtos/CreateUserDTO";
import { CreateUserUseCase } from "../../../../../application/usecases/user/CreateUserUseCase";

export class CreateUserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase
    ) { }

    async handle(c: Context) {
        try {
            const body = await c.req.json()

            const { email, password, lastName, firstName }: CreateUserDTO = body

            const newUser = await this.createUserUseCase.execute({
                email,
                password,
                lastName,
                firstName
            })

            return c.json({ user: newUser }, HttpStatusCodes.CREATED)
        } catch (error: any) {
            if (error instanceof DomainError) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode)
            }

            return c.json({ message: "Internal server error" }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}