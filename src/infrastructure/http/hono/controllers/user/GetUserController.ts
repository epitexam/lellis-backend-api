import { Context } from "hono";
import { GetUserUseCase } from "../../../../../application/usecases/user/GetUserUseCase";
import { HttpStatusCodes } from "../../../../../application/interfaces/HttpStatusCodes";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { DomainError } from "../../../../../application/interfaces/IDomainError";

export class GetUserController {
    constructor(
        private readonly getUserUseCase: GetUserUseCase
    ) { }

    async handle(c: Context) {
        try {
            const { id } = c.req.param()

            const user = await this.getUserUseCase.execute(id)

            return c.json(user, HttpStatusCodes.ACCEPTED)
        } catch (error: any) {
            if (error instanceof DomainError) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode)
            }

            return c.json({ message: "Internal server error" }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}