import { IUserRepository } from "../../../application/repositories/user/IUserRepository";
import { GetUserUseCase } from "../../../application/usecases/user/GetUserUseCase";
import { PrismaUserRepository } from "../../database/user/PrismaUserRepository";
import { GetUserController } from "../../http/hono/controllers/user/GetUserController";

export function GetUserComposer() {
    const repository: IUserRepository = new PrismaUserRepository();
    const usecase = new GetUserUseCase(repository);
    const controller = new GetUserController(usecase);

    return controller
}