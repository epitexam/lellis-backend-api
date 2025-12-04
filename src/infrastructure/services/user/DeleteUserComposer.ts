import { IUserRepository } from "../../../application/repositories/user/IUserRepository";
import { DeleteUserUseCase } from "../../../application/usecases/user/DeleteUserUseCase";
import { PrismaUserRepository } from "../../database/user/PrismaUserRepository";
import { DeleteUserController } from "../../http/hono/controllers/user/DeleteUserController";

export function DeleteUserComposer() {
    const repository: IUserRepository = new PrismaUserRepository();
    const usecase = new DeleteUserUseCase(repository);
    const controller = new DeleteUserController(usecase);

    return controller
}