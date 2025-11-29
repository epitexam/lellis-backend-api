/**
 * Service for password hashing operations
 * @interface
 */
export interface IPasswordHasher {
    /**
     * Hashes a plain text password
     * @param {string} plainPassword - The plain text password
     * @returns {Promise<string>} The hashed password
     */
    hash(plainPassword: string): Promise<string>;

    /**
     * Verifies a plain text password against a hash
     * @param {string} plainPassword - The plain text password
     * @param {string} hash - The hashed password to verify against
     * @returns {Promise<boolean>} True if the password matches the hash
     */
    verify(plainPassword: string, hash: string): Promise<boolean>;
}