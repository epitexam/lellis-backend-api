import { Context } from "hono";
import { SearchUsersUseCase } from "../../../../../application/usecases/user/SearchUserUseCase";
import { DomainError } from "../../../../../application/interfaces/IDomainError";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { HttpStatusCodes } from "../../../../../application/interfaces/HttpStatusCodes";
import { UserStatus } from "../../../../../domain/user/enums/UserStatus";
import { UserQueryDTO } from "../../../../../domain/user/dtos/UserQueryDTO";

export class SearchUserController {

    constructor(
        private readonly searchUserUseCase: SearchUsersUseCase
    ) { }

    async handle(c: Context) {
        try {
            const { page, limit, search, status, sortBy, sortOrder } = c.req.query();

            const parsedSortOrder = sortOrder === 'asc' || sortOrder === 'desc'
                ? sortOrder
                : 'desc';

            const dto = new UserQueryDTO(
                Number(page),
                Number(limit),
                search,
                status as UserStatus,
                sortBy,
                parsedSortOrder
            );

            const userList = await this.searchUserUseCase.execute(dto);

            return c.json({ users: userList }, HttpStatusCodes.OK);

        } catch (error) {
            if (error instanceof DomainError) {
                return c.json({ message: error.message }, error.statusCode as ContentfulStatusCode);
            }

            return c.json({ message: "Internal server error" }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

}