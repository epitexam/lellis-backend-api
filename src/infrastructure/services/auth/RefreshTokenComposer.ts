import { Hono } from "hono";
import { IJwtService } from "../../../domain/auth/security/IJwtService";
import { HonoJwtService } from "../../security/HonoJwtService";
import { BunIdProvider } from "../../provider/BunIdProvider";
import { IIdProvider } from "../../../application/providers/IIdProvider";
import { IAuthRepository } from "../../../application/repositories/auth/IAuthRepository";
import { RedisAuthRepository } from "../../database/auth/RedisAuthRepository";
import { RefreshAccessTokenUseCase } from "../../../application/usecases/auth/RefreshTokenUseCase";
import { RefreshTokenController } from "../../http/hono/controllers/auth/RefreshTokenController";

export function RefreshTokenComposer() {
    const authRepository: IAuthRepository = new RedisAuthRepository()

    const idProvider: IIdProvider = new BunIdProvider()
    const jwtService: IJwtService = new HonoJwtService(process.env.SECRET || "test_secret_key_fixed_for_reproducible_tests_12345", 3600, Number(process.env.DAYS) || 7)


    const usecase = new RefreshAccessTokenUseCase(jwtService,authRepository,idProvider); 
    const controller = new RefreshTokenController(usecase)

    return controller
}