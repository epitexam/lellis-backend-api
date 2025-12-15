import { UserId } from "../../user/valueObjects/UserId";
import { TokenError, TokenErrorType } from "../enums/TokenErrorType";
import { Token } from "./Token";

/**
 * @file AccessToken.ts
 * @description Domain Entity representing a short-lived Access Token used for
 * authenticating API requests.
 * Extends the base Token class.
 */
export class AccessToken extends Token {
    /**
     * @property {string[]} scopes - The permissions/scopes granted by this token.
     */
    public readonly scopes: string[];

    /**
     * Private constructor to enforce creation via static factory methods.
     */
    private constructor(
        id: string,
        tokenString: string,
        userId: UserId,
        expiresAt: Date,
        issuedAt: Date,
        isRevoked: boolean = false,
        scopes: string[] = []
    ) {
        super(id, tokenString, userId, expiresAt, issuedAt, isRevoked);
        this.scopes = scopes;
    }

    /**
     * Static factory method to create a new AccessToken instance.
     * @param {string} id - A unique ID for the token entity.
     * @param {string} tokenString - The token value itself.
     * @param {UserId} userId - The ID of the user.
     * @param {Date} expiresAt - The expiration date.
     * @param {string[]} scopes - The permissions/scopes for this token.
     * @param {Date} [issuedAt=new Date()] - Optional issuance date, defaults to current time.
     * @returns {AccessToken} A new AccessToken entity.
     */
    public static createNew(
        id: string,
        tokenString: string,
        userId: UserId,
        expiresAt: Date,
        scopes: string[] = [],
        issuedAt: Date = new Date()
    ): AccessToken {
        // Validate common parameters
        Token.validateCommonParameters(id, tokenString, userId, expiresAt, issuedAt);

        // Additional access token specific validation
        const defaultAccessTokenLifetime = 15 * 60 * 1000; // 15 minutes in milliseconds
        const maxLifetime = 24 * 60 * 60 * 1000; // 24 hours max

        const tokenLifetime = expiresAt.getTime() - issuedAt.getTime();

        if (tokenLifetime > maxLifetime) {
            throw new TokenError(TokenErrorType.TOO_LONG_LIFETIME);
        }

        return new AccessToken(id, tokenString, userId, expiresAt, issuedAt, false, scopes);
    }

    /**
     * Static factory method to recreate an entity from persistent storage.
     * @param {string} id - The unique ID of the token record.
     * @param {string} tokenString - The opaque token value.
     * @param {UserId} userId - The ID of the owner user.
     * @param {Date} expiresAt - The expiration date.
     * @param {Date} issuedAt - The issuance date.
     * @param {boolean} isRevoked - The current revocation status.
     * @param {string[]} scopes - The permissions/scopes.
     * @returns {AccessToken} A recreated AccessToken entity.
     */
    public static fromPersistence(
        id: string,
        tokenString: string,
        userId: UserId,
        expiresAt: Date,
        issuedAt: Date,
        isRevoked: boolean,
        scopes: string[] = []
    ): AccessToken {
        return new AccessToken(id, tokenString, userId, expiresAt, issuedAt, isRevoked, scopes);
    }

    /**
     * Check if the token has a specific scope.
     * @param {string} scope - The scope to check.
     * @returns {boolean} True if the token has the scope.
     */
    public hasScope(scope: string): boolean {
        return this.scopes.includes(scope);
    }

    /**
     * Check if the token has all of the specified scopes.
     * @param {string[]} requiredScopes - The scopes to check.
     * @returns {boolean} True if the token has all required scopes.
     */
    public hasAllScopes(requiredScopes: string[]): boolean {
        return requiredScopes.every(scope => this.hasScope(scope));
    }

    /**
     * Check if the token has any of the specified scopes.
     * @param {string[]} requiredScopes - The scopes to check.
     * @returns {boolean} True if the token has at least one required scope.
     */
    public hasAnyScope(requiredScopes: string[]): boolean {
        return requiredScopes.some(scope => this.hasScope(scope));
    }

    /**
     * Implementation of abstract method to get token type.
     * @returns {string} Token type identifier.
     */
    public getTokenType(): string {
        return "access_token";
    }
}