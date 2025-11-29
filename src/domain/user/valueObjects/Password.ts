/**
 * Password Value Object - Represents a securely hashed password
 * Immutable, validated at creation time, encapsulates hashing + complexity rules
 *
 * @valueObject
 * @domain User
 */
import { IPasswordHasher } from "../../../application/providers/IPasswordHasher";
import { PasswordError, PasswordErrorType } from "../enums/PasswordErrorType";

export class Password {
    private static readonly MIN_LENGTH = 8;
    private static readonly MAX_LENGTH = 64;

    /** Private constructor - use Password.create() or Password.fromHash() */
    private constructor(private readonly hash: string) { }

    /** @returns {string} The stored bcrypt/argon2 hash */
    public getHash(): string {
        return this.hash;
    }

    /**
     * Factory: creates a new Password from plain text (registration / change password)
     * Performs full complexity validation + hashing
     *
     * @param plainPassword - Raw user password
     * @param hasher - Injected password hasher (bcrypt, argon2, etc.)
     * @throws {PasswordError} if validation fails
     */
    public static async create(
        plainPassword: string,
        hasher: IPasswordHasher
    ): Promise<Password> {
        this.validateComplexity(plainPassword);
        const hash = await hasher.hash(plainPassword);
        if (!hash || hash.length < 32) {
            throw new PasswordError(PasswordErrorType.InvalidPasswordHash);
        }
        return new Password(hash);
    }

    /**
     * Factory: reconstitute Password from stored hash (login / DB load)
     * Only validates hash format, no complexity check (already done at creation)
     */
    public static fromHash(hash: string): Password {
        if (!hash || hash.trim().length < 32) {
            throw new PasswordError(PasswordErrorType.InvalidPasswordHash);
        }
        return new Password(hash.trim());
    }

    /** Full complexity validation - throws domain-specific PasswordError */
    private static validateComplexity(password: string): void {
        if (!password) throw new PasswordError(PasswordErrorType.TooShort);
        if (password.length < this.MIN_LENGTH) throw new PasswordError(PasswordErrorType.TooShort);
        if (password.length > this.MAX_LENGTH) throw new PasswordError(PasswordErrorType.TooLong);
        if (/\s/.test(password)) throw new PasswordError(PasswordErrorType.ContainsWhitespace);
        if (!/[A-Z]/.test(password)) throw new PasswordError(PasswordErrorType.MissingUppercase);
        if (!/[a-z]/.test(password)) throw new PasswordError(PasswordErrorType.MissingLowercase);
        if (!/\d/.test(password)) throw new PasswordError(PasswordErrorType.MissingNumber);
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
            throw new PasswordError(PasswordErrorType.MissingSpecialChar);
    }

    /** Value-based equality */
    public equals(other: Password | null): boolean {
        return other !== null && this.hash === other.hash;
    }

    public toString(): string {
        return `***${this.hash.slice(-6)}`;
    }

    public toJSON(): string {
        return this.hash;
    }
}