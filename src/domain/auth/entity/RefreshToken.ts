// RefreshToken.ts - Classe pour les Refresh Tokens
import { UserId } from "../../user/valueObjects/UserId";
import { Token } from "./Token";
import { TokenError, TokenErrorType } from "../enums/TokenErrorType";

/**
 * @file RefreshToken.ts
 * @description Domain Entity representing a long-lived Refresh Token used for
 * obtaining new Access Tokens without re-authentication.
 * Extends the base Token class.
 */
export class RefreshToken extends Token {
    /**
     * Private constructor to enforce creation via static factory methods.
     */
    private constructor(
        id: string,
        tokenString: string,
        userId: UserId,
        expiresAt: Date,
        issuedAt: Date,
        isRevoked: boolean = false
    ) {
        super(id, tokenString, userId, expiresAt, issuedAt, isRevoked);
    }

    /**
     * Static factory method to create a new RefreshToken instance.
     * @param {string} id - A unique ID for the token entity.
     * @param {string} tokenString - The token value itself.
     * @param {UserId} userId - The ID of the user.
     * @param {Date} expiresAt - The expiration date.
     * @param {Date} [issuedAt=new Date()] - Optional issuance date, defaults to current time.
     * @returns {RefreshToken} A new RefreshToken entity.
     */
    public static createNew(
        id: string,
        tokenString: string,
        userId: UserId,
        expiresAt: Date,
        issuedAt: Date = new Date()
    ): RefreshToken {
        // Validate common parameters
        Token.validateCommonParameters(id, tokenString, userId, expiresAt, issuedAt);

        // Additional refresh token specific validation if needed
        const defaultRefreshTokenLifetime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        const maxLifetime = 30 * 24 * 60 * 60 * 1000; // 30 days max
        
        const tokenLifetime = expiresAt.getTime() - issuedAt.getTime();
        
        if (tokenLifetime < defaultRefreshTokenLifetime) {
            throw new TokenError(TokenErrorType.TOO_SHORT_LIFETIME);
        }
        
        if (tokenLifetime > maxLifetime) {
            throw new TokenError(TokenErrorType.TOO_LONG_LIFETIME);
        }

        return new RefreshToken(id, tokenString, userId, expiresAt, issuedAt, false);
    }

    /**
     * Static factory method to recreate an entity from persistent storage.
     * @param {string} id - The unique ID of the token record.
     * @param {string} tokenString - The opaque token value.
     * @param {UserId} userId - The ID of the owner user.
     * @param {Date} expiresAt - The expiration date.
     * @param {Date} issuedAt - The issuance date.
     * @param {boolean} isRevoked - The current revocation status.
     * @returns {RefreshToken} A recreated RefreshToken entity.
     */
    public static fromPersistence(
        id: string,
        tokenString: string,
        userId: UserId,
        expiresAt: Date,
        issuedAt: Date,
        isRevoked: boolean
    ): RefreshToken {
        return new RefreshToken(id, tokenString, userId, expiresAt, issuedAt, isRevoked);
    }

    /**
     * Domain method to rotate the refresh token (create a new one and revoke the old one).
     * @param {string} newTokenId - The new token ID.
     * @param {string} newTokenString - The new token string.
     * @param {Date} newExpiresAt - The new expiration date.
     * @returns {RefreshToken} A new refresh token.
     */
    public rotate(newTokenId: string, newTokenString: string, newExpiresAt: Date): RefreshToken {
        this.revoke(); // Revoke the current token
        return RefreshToken.createNew(
            newTokenId,
            newTokenString,
            this.userId,
            newExpiresAt
        );
    }

    /**
     * Implementation of abstract method to get token type.
     * @returns {string} Token type identifier.
     */
    public getTokenType(): string {
        return "refresh_token";
    }
}