import { Context } from "hono";
import { DeleteUserUseCase } from "../../../../../application/usecases/user/DeleteUserUseCase";
import { DomainError } from "../../../../../application/interfaces/IDomainError";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { HttpStatusCodes } from "../../../../../application/interfaces/HttpStatusCodes";
import { UserError, UserErrorType } from "../../../../../domain/user/enums/UserErrorType";

export class DeleteUserController {
    constructor(
        private readonly deleteUserUseCase: DeleteUserUseCase
    ) { }

    async handle(c: Context) {
        try {
            const { id } = c.req.param();

            if (!id) throw new UserError(UserErrorType.MISSING_USER_UUID)

            const deletedUser = await this.deleteUserUseCase.execute(id)

            return c.json({}, HttpStatusCodes.NO_CONTENT as ContentfulStatusCode)
        } catch (error: any) {

            if (error instanceof DomainError) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode)
            }

            return c.json({ message: error.message || "Internal server error" }, HttpStatusCodes.INTERNAL_SERVER_ERROR)
        }
    }
}