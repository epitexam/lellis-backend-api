import { IAuthRepository } from "../../../application/repositories/auth/IAuthRepository";
import { RefreshToken } from "../../../domain/auth/entity/RefreshToken";
import { UserId } from "../../../domain/user/valueObjects/UserId";
import { RedisClient } from "bun";
import { getRedisClient } from "../config/redis";

/**
 * Redis-based implementation of the authentication repository.
 * Stores refresh tokens as Redis Hashes and maintains a Set of active token strings per user
 * to enable efficient global revocation.
 */
export class RedisAuthRepository implements IAuthRepository {
    private client: RedisClient;
    private readonly KEY_PREFIX = "refresh_token:";
    private readonly USER_TOKENS_SET_PREFIX = "user_tokens:";

    constructor() {
        this.client = getRedisClient();
    }

    /**
     * Generates the Redis key for a specific refresh token.
     *
     * @param tokenString The opaque refresh token string.
     * @returns The full Redis key.
     */
    private getTokenKey(tokenString: string): string {
        return this.KEY_PREFIX + tokenString;
    }

    /**
     * Generates the Redis key for the Set containing all active token strings of a user.
     *
     * @param userId The user's unique identifier.
     * @returns The full Redis Set key.
     */
    private getUserSetKey(userId: UserId): string {
        return this.USER_TOKENS_SET_PREFIX + userId.toString();
    }

    /**
     * Converts a RefreshToken entity into a flat array suitable for Redis HMSET.
     * Dates are stored as millisecond timestamps, and boolean values as "1"/"0".
     *
     * @param token The RefreshToken entity to serialize.
     * @returns An array of field-value pairs for Redis Hash storage.
     */
    private static entityToHash(token: RefreshToken): string[] {
        return [
            "id", token.id,
            "userId", token.userId.toString(),
            "expiresAt", token.expiresAt.getTime().toString(),
            "issuedAt", token.issuedAt.getTime().toString(),
            "isRevoked", token.isRevoked ? "1" : "0",
        ];
    }

    /**
     * Reconstructs a RefreshToken entity from a Redis Hash.
     *
     * @param hash The hash retrieved from Redis (field → value).
     * @param tokenString The original token string (used as the Redis key, not stored in the hash).
     * @returns The reconstituted RefreshToken or null if the hash is empty/invalid.
     */
    private static hashToEntity(hash: Record<string, string>, tokenString: string): RefreshToken | null {
        if (!hash || Object.keys(hash).length === 0) {
            return null;
        }

        return RefreshToken.fromPersistence(
            hash.id,
            tokenString,
            UserId.create(hash.userId),
            new Date(parseInt(hash.expiresAt)),
            new Date(parseInt(hash.issuedAt)),
            hash.isRevoked === "1"
        );
    }

    /**
     * Saves a new refresh token in Redis.
     *
     * - Stores token details as a Hash.
     * - Sets automatic expiration matching the token's expiry time.
     * - Adds the token string to the user's active token Set for future revocation.
     *
     * @param refreshToken The RefreshToken entity to persist.
     */
    async saveRefreshToken(refreshToken: RefreshToken): Promise<void> {
        const key = this.getTokenKey(refreshToken.tokenString);
        const userSetKey = this.getUserSetKey(refreshToken.userId);
        const hash = RedisAuthRepository.entityToHash(refreshToken);

        const pipeline = [
            this.client.hmset(key, hash),
            this.client.expireat(key, Math.floor(refreshToken.expiresAt.getTime() / 1000)),
            this.client.sadd(userSetKey, refreshToken.tokenString)
        ];

        await Promise.all(pipeline);
    }

    /**
     * Retrieves a refresh token by its string value.
     *
     * @param tokenString The opaque refresh token string.
     * @returns The corresponding RefreshToken entity or null if not found.
     */
    async findRefreshTokenByString(tokenString: string): Promise<RefreshToken | null> {
        const key = this.getTokenKey(tokenString);
        const hash = await this.client.hgetall(key);

        if (!hash) {
            return null;
        }

        return RedisAuthRepository.hashToEntity(hash, tokenString);
    }

    /**
     * Updates the revocation status of an existing refresh token.
     * Only the `isRevoked` field is modified.
     *
     * @param refreshToken The RefreshToken entity with updated revocation status.
     */
    async updateRefreshToken(refreshToken: RefreshToken): Promise<void> {
        const key = this.getTokenKey(refreshToken.tokenString);
        await this.client.hset(key, "isRevoked", refreshToken.isRevoked ? "1" : "0");
    }

    /**
     * Revokes all refresh tokens belonging to a specific user.
     * Deletes each individual token Hash and the user's token Set in a single atomic operation.
     *
     * @param userId The ID of the user whose tokens should be revoked.
     */
    async revokeAllUserTokens(userId: UserId): Promise<void> {
        const userSetKey = this.getUserSetKey(userId);
        const tokenStrings = await this.client.smembers(userSetKey);

        if (tokenStrings.length === 0) return;

        const keysToDelete = tokenStrings.map((ts: string) => this.getTokenKey(ts));
        keysToDelete.push(userSetKey);

        await this.client.del(...keysToDelete);
    }
}