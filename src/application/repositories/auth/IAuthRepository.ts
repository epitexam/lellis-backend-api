import { RefreshToken } from "../../../domain/auth/entity/RefreshToken";
import { UserId } from "../../../domain/user/valueObjects/UserId";

/**
 * Interface representing the persistence capabilities for Authentication-related data.
 * This repository is specifically responsible for handling the RefreshToken entities.
 *
 * It is a Port definition in the Application layer, implemented by the Infrastructure layer.
 */
export interface IAuthRepository {
    /**
     * Saves a new RefreshToken entity to persistent storage (e.g., database).
     * This is called during the initial login or when a token is rotated.
     * @param {RefreshToken} refreshToken - The complete RefreshToken  to save.
     * @returns {Promise<void>}
     */
    saveRefreshToken(refreshToken: RefreshToken): Promise<void>;

    /**
     * Finds a RefreshToken entity based on its unique token string.
     * This is crucial for the RefreshAccessToken Use Case.
     * @param {string} tokenString - The opaque string value of the Refresh Token.
     * @returns {Promise<RefreshToken | null>} The matching RefreshToken entity, or null if not found.
     */
    findRefreshTokenByString(tokenString: string): Promise<RefreshToken | null>;

    /**
     * Updates the status of an existing RefreshToken in the database (e.g., to revoke it).
     * This is used during logout or token rotation to invalidate the old token.
     * @param {RefreshToken} refreshToken - The updated RefreshToken entity (e.g., with isRevoked = true).
     * @returns {Promise<void>}
     */
    updateRefreshToken(refreshToken: RefreshToken): Promise<void>;

    /**
     * Revokes all Refresh Tokens associated with a specific user ID.
     * Used typically when an account password is changed or for a full session cleanup.
     * @param {UserId} userId - The identifier of the user.
     * @returns {Promise<void>}
     */
    revokeAllUserTokens(userId: UserId): Promise<void>;
}