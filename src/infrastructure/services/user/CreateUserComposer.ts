import { IIdProvider } from "../../../application/providers/IIdProvider";
import { IPasswordHasher } from "../../../application/providers/IPasswordHasher";
import { IUserRepository } from "../../../application/repositories/user/IUserRepository";
import { CreateUserUseCase } from "../../../application/usecases/user/CreateUserUseCase";
import { PrismaUserRepository } from "../../database/user/PrismaUserRepository";
import { CreateUserController } from "../../http/hono/controllers/user/CreateUserController";
import { BunIdProvider } from "../../provider/BunIdProvider";
import { BunPasswordHasher } from "../../provider/BunPasswordHasher";

export function CreateUserComposer() {
    const repository: IUserRepository = new PrismaUserRepository();

    const passwordHasher: IPasswordHasher = new BunPasswordHasher();
    const idProvider: IIdProvider = new BunIdProvider()
    
    const usecase = new CreateUserUseCase(repository, passwordHasher, idProvider);
    const controller = new CreateUserController(usecase)

    return controller
}