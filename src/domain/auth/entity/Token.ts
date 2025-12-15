import { UserId } from "../../user/valueObjects/UserId";
import { TokenError, TokenErrorType } from "../enums/TokenErrorType";

/**
 * @file Token.ts
 * @description Abstract base class representing a generic authentication token.
 * This entity belongs to the Domain layer of the Clean Architecture.
 */
export abstract class Token {
    /**
     * @property {string} id - Unique identifier for the Token record (UUID or similar).
     */
    public readonly id: string;

    /**
     * @property {string} tokenString - The actual opaque token value (JWT or random string).
     */
    public readonly tokenString: string;

    /**
     * @property {UserId} userId - The identifier of the user who owns this token.
     */
    public readonly userId: UserId;

    /**
     * @property {Date} expiresAt - The timestamp when this token becomes invalid.
     */
    public expiresAt: Date;

    /**
     * @property {boolean} isRevoked - Flag indicating if the token has been deliberately invalidated.
     */
    public isRevoked: boolean;

    /**
     * @property {Date} issuedAt - The timestamp when the token was created.
     */
    public readonly issuedAt: Date;

    /**
     * Protected constructor for base class.
     * @param {string} id - The unique ID of the token record.
     * @param {string} tokenString - The opaque token value.
     * @param {UserId} userId - The ID of the owner user.
     * @param {Date} expiresAt - The expiration date.
     * @param {Date} issuedAt - The issuance date.
     * @param {boolean} isRevoked - Initial revocation status.
     */
    protected constructor(
        id: string,
        tokenString: string,
        userId: UserId,
        expiresAt: Date,
        issuedAt: Date,
        isRevoked: boolean = false
    ) {
        this.id = id;
        this.tokenString = tokenString;
        this.userId = userId;
        this.expiresAt = expiresAt;
        this.issuedAt = issuedAt;
        this.isRevoked = isRevoked;
    }

    /**
     * Protected validation method for common token parameters.
     * @param {string} id - Token ID.
     * @param {string} tokenString - Token string.
     * @param {UserId} userId - User ID.
     * @param {Date} expiresAt - Expiration date.
     * @param {Date} issuedAt - Issuance date.
     * @protected
     */
    protected static validateCommonParameters(
        id: string,
        tokenString: string,
        userId: UserId,
        expiresAt: Date,
        issuedAt: Date
    ): void {
        if (!id || !tokenString || !userId || !(expiresAt instanceof Date)) {
            throw new TokenError(TokenErrorType.INVALID_PARAMETERS);
        }

        if (expiresAt.getTime() <= issuedAt.getTime()) {
            throw new TokenError(TokenErrorType.INVALID_EXPIRATION);
        }
    }

    /**
     * Domain method to check if the token is currently active and valid.
     * @returns {boolean} True if the token is not expired and not revoked.
     */
    public isValid(): boolean {
        const now = new Date();
        return !this.isRevoked && (this.expiresAt.getTime() > now.getTime());
    }

    /**
     * Domain method to mark the token as permanently invalid.
     */
    public revoke(): void {
        this.isRevoked = true;
    }

    /**
     * Domain method to check if the token has expired.
     * @returns {boolean} True if the current time is after the expiration time.
     */
    public isExpired(): boolean {
        const now = new Date();
        return this.expiresAt.getTime() <= now.getTime();
    }

    /**
     * Abstract method to get token type.
     * @returns {string} Token type identifier.
     */
    public abstract getTokenType(): string;
}