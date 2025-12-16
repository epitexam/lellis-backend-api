import { IIdProvider } from "../../../application/providers/IIdProvider";
import { IPasswordHasher } from "../../../application/providers/IPasswordHasher";
import { IAuthRepository } from "../../../application/repositories/auth/IAuthRepository";
import { IUserRepository } from "../../../application/repositories/user/IUserRepository";
import { LogInUseCase } from "../../../application/usecases/auth/LogInUseCase";
import { IJwtService } from "../../../domain/auth/security/IJwtService";
import { RedisAuthRepository } from "../../database/auth/RedisAuthRepository";
import { db } from "../../database/config/mysql";
import { MySqlUserRepository } from "../../database/user/MySqlUserRepository";
import { LoginController } from "../../http/hono/controllers/auth/LoginController";
import { BunIdProvider } from "../../provider/BunIdProvider";
import { BunPasswordHasher } from "../../provider/BunPasswordHasher";
import { HonoJwtService } from "../../security/HonoJwtService";

export function LoginComposer() {
    const userRepository: IUserRepository = new MySqlUserRepository(db)
    const authRepository: IAuthRepository = new RedisAuthRepository()

    const passwordHasher: IPasswordHasher = new BunPasswordHasher()
    const idProvider: IIdProvider = new BunIdProvider()
    const jwtService: IJwtService = new HonoJwtService(process.env.SECRET  || "test_secret_key_fixed_for_reproducible_tests_12345", 3600, Number(process.env.DAYS) || 7)

    const usecase = new LogInUseCase(userRepository, passwordHasher, jwtService, authRepository, idProvider)

    const controller = new LoginController(usecase)

    return controller
}