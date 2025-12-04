import { IUserRepository } from "../../../application/repositories/user/IUserRepository";
import { SearchUsersUseCase } from "../../../application/usecases/user/SearchUserUseCase";
import { PrismaUserRepository } from "../../database/user/PrismaUserRepository";
import { SearchUserController } from "../../http/hono/controllers/user/SearchUserController";

export function SearchUserComposer() {
    const repository: IUserRepository = new PrismaUserRepository();
    const usecase = new SearchUsersUseCase(repository);
    const controller = new SearchUserController(usecase);

    return controller
}