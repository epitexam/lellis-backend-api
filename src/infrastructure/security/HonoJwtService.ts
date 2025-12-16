import { TokenError, TokenErrorType } from "../../domain/auth/enums/TokenErrorType";
import { IJwtService } from "../../domain/auth/security/IJwtService";
import { UserId } from "../../domain/user/valueObjects/UserId";
import { decode, sign, verify } from 'hono/jwt'

const ACCESS_TOKEN_EXPIRY_SECONDS = 3600;
const REFRESH_TOKEN_EXPIRY_DAYS = Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS) ||  7;

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_DE_DEVELOPPEMENT_A_NE_PAS_UTILISER_EN_PROD';

/**
 * @class HonoJwtService
 * @implements {IJwtService}
 * @description Concrete implementation of the IJwtService port using Hono's JWT utilities.
 * This class belongs to the Infrastructure layer.
 */
export class HonoJwtService implements IJwtService {

    /**
     * @public
     * @returns {Date} Calculates the expiration date for the Refresh Token 
     */
    public getRefreshTokenExpirationDate(): Date {
        const date = new Date();
        date.setDate(date.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);
        return date;
    }

    /**
     * @public
     * @async
     * @param {UserId} userId - The identifier of the user (Value Object).
     * @returns {Promise<string>} The generated short-lived Access Token string.
     */
    public async generateAccessToken(userId: UserId): Promise<string> {
        const payload = {
            sub: userId.toString(), // Conversion en string pour le JWT
            exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRY_SECONDS,
            iat: Math.floor(Date.now() / 1000)
        };
        return sign(payload, JWT_SECRET);
    }

    /**
     * @public
     * @async
     * @param {UserId} userId - The identifier of the user (Value Object).
     * @returns {Promise<string>} The generated long-lived Refresh Token string.
     */
    public async generateRefreshToken(userId: UserId): Promise<string> {
        const payload = {
            sub: userId.toString(),
            iat: Math.floor(Date.now() / 1000)
        };
        return sign(payload, JWT_SECRET);
    }

    /**
     * @public
     * @async
     * @param {string} token - The Access Token string provided by the client.
     * @returns {Promise<{ userId: string }>} A promise resolving to the token's payload.
     * @throws {TokenError} Throws an error if the token is invalid, expired, or malformed.
     */
    public async verifyAccessToken(token: string): Promise<{ userId: string }> {
        try {
            const payload = await verify(token, JWT_SECRET);

            if (!payload || typeof payload.sub !== 'string') {
                throw new TokenError(TokenErrorType.INVALID_PAYLOAD);
            }


            return { userId: payload.sub };

        } catch (error) {
            console.error("JWT Verification failed:", error);

            throw new TokenError(TokenErrorType.INVALID_OR_EXPIRED_TOKEN);
        }
    }
}