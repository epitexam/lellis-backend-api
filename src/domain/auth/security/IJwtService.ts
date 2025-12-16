import { UserId } from "../../user/valueObjects/UserId";

/**
 * Interface representing the capabilities of the JWT service layer (Infrastructure).
 * This service handles the technical aspects of creating, signing, and validating tokens.
 *
 * It is a Port definition in the Application layer of the Clean Architecture.
 */
export interface IJwtService {
    /**
     * Generates a short-lived Access Token (JWT) signed with the server's secret.
     * @param {UserId} userId - The identifier of the user (e.g., UUID string from the UserId value object).
     * @returns {Promise<string>} The generated Access Token string.
     */
    generateAccessToken(userId: UserId): Promise<string>;

    /**
     * Generates a long-lived Refresh Token (can be a signed JWT or an opaque random string).
     * @param {UserId} userId - The identifier of the user.
     * @returns {Promise<string>} The generated Refresh Token string.
     */
    generateRefreshToken(userId: UserId): Promise<string>;

    /**
     * Verifies the signature and expiration of an Access Token, and extracts its payload.
     * This is used by the Authentication Middleware to protect routes.
     * @param {string} token - The Access Token string provided by the client.
     * @returns {Promise<{ userId: string }>} A promise that resolves to the token's payload (at least the user ID).
     * @throws {Error} Throws an error if the token is invalid, expired, or malformed.
     */
    verifyAccessToken(token: string): Promise<{ userId: string }>;

    /**
     * Calculates the expiration date for a newly generated Refresh Token.
     * This date will be used by the Auth Repository to persist the token's expiry time.
     * @returns {Date} The calculated future expiration date.
     */
    getRefreshTokenExpirationDate(): Date;
}