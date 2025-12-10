import { IAuthRepository } from "../../../application/repositories/auth/IAuthRepository";
import { RefreshToken } from "../../../domain/auth/entity/RefreshToken";
import { UserId } from "../../../domain/user/valueObjects/UserId";

export class RedisAuthRepository implements IAuthRepository {
    saveRefreshToken(refreshToken: RefreshToken): Promise<void> {
        throw new Error("Method not implemented yet.")
    }

    findRefreshTokenByString(tokenString: string): Promise<RefreshToken | null> {
        throw new Error("Method not implemented yet.")
    }

    updateRefreshToken(refreshToken: RefreshToken): Promise<void> {
        throw new Error("Method not implemented yet.")
    }

    revokeAllUserTokens(userId: UserId): Promise<void> {
        throw new Error("Method not implemented yet.")
    }
}