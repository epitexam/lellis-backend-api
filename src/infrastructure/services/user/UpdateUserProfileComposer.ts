import { IUserRepository } from "../../../application/repositories/user/IUserRepository";
import { UpdateUserProfileUseCase } from "../../../application/usecases/user/UpdateUserProfileUseCase";
import { PrismaUserRepository } from "../../database/user/PrismaUserRepository";
import { UpdateUserProfileController } from "../../http/hono/controllers/user/UpdateUserProfileController";

export function UpdateUserProfileComposer() {
    const repository: IUserRepository = new PrismaUserRepository();
    const usecase = new UpdateUserProfileUseCase(repository);
    const controller = new UpdateUserProfileController(usecase);
    return controller
}