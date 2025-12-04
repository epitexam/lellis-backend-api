import { ContentfulStatusCode } from "hono/utils/http-status";
import { UpdateUserProfileUseCase } from "../../../../../application/usecases/user/UpdateUserProfileUseCase";
import { DomainError } from "../../../../../application/interfaces/IDomainError";
import { HttpStatusCodes } from "../../../../../application/interfaces/HttpStatusCodes";
import { Context } from "hono";

export class UpdateUserProfileController {

    constructor(
        private readonly updateUserUseCase: UpdateUserProfileUseCase
    ) { }

    async handle(c: Context) {
        try {
            const { user_id, firstName, lastName, email } = await c.req.json()

            const updatedUser = await this.updateUserUseCase.execute(user_id, {
                firstName,
                lastName,
                email
            })

            return c.json({}, HttpStatusCodes.NO_CONTENT as ContentfulStatusCode)
        } catch (error) {
            if (error instanceof DomainError) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode);
            }

            return c.json({ message: "Internal server error" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}