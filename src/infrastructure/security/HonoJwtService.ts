import { IJwtService } from "../../domain/auth/security/IJwtService";
import { TokenError, TokenErrorType } from "../../domain/auth/enums/TokenErrorType";
import { UserId } from "../../domain/user/valueObjects/UserId";
import { sign, verify } from "hono/jwt";

/**
 * @class HonoJwtService
 * @implements {IJwtService}
 * @description Infrastructure implementation of the JWT generation and verification logic.
 */
export class HonoJwtService implements IJwtService {

    /**
     * @param {string} secret - Signing secret for JWT.
     * @param {number} accessTokenExpirySeconds - Lifetime of access tokens in seconds.
     * @param {number} refreshTokenExpiryDays - Lifetime of refresh tokens in days.
     */
    constructor(
        private readonly secret: string,
        private readonly accessTokenExpirySeconds: number,
        private readonly refreshTokenExpiryDays: number
    ) { }

    /**
     * @inheritdoc
     */
    public async generateAccessToken(userId: UserId): Promise<string> {
        const now = Math.floor(Date.now() / 1000);

        const payload = {
            sub: userId.toString(),
            iat: now,
            exp: now + this.accessTokenExpirySeconds
        };

        return sign(payload, this.secret);
    }

    /**
     * @inheritdoc
     */
    public async generateRefreshToken(userId: UserId): Promise<string> {
        const now = Math.floor(Date.now() / 1000);

        const payload = {
            sub: userId.toString(),
            iat: now,
            exp: now + this.refreshTokenExpiryDays * 86400
        };

        return sign(payload, this.secret);
    }

    /**
     * @inheritdoc
     */
    public async verifyAccessToken(token: string): Promise<{ userId: string }> {
        try {
            const payload = await verify(token, this.secret);

            if (!payload || typeof payload.sub !== "string") {
                throw new TokenError(TokenErrorType.INVALID_PAYLOAD);
            }

            if (typeof payload.exp === "number" && payload.exp < Date.now() / 1000) {
                throw new TokenError(TokenErrorType.EXPIRED_TOKEN);
            }

            return { userId: payload.sub };

        } catch {
            throw new TokenError(TokenErrorType.INVALID_OR_EXPIRED_TOKEN);
        }
    }

    /**
     * @inheritdoc
     */
    public getRefreshTokenExpirationDate(): Date {
        const date = new Date();
        date.setDate(date.getDate() + this.refreshTokenExpiryDays);
        return date;
    }
}
