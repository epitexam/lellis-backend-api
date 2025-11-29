import { UserError, UserErrorType } from "../enums/UserErrorType";

/**
 * Email Value Object - Represents a validated and normalized email address
 * Immutable, equality by value, part of the Domain layer
 * @valueObject
 * @domainEntity
 */
export class Email {
    /** Comprehensive RFC-compliant regex (simplified but strong enough for most cases) */
    private static readonly EMAIL_REGEX =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    /** Private constructor - use Email.create() instead */
    private constructor(private readonly value: string) { }

    /**
     * Factory method - Preferred way to create an Email
     * Guarantees that only valid emails are instantiated
     *
     * @param {string} candidate - Raw email string from outside the domain
     * @returns {Email} A valid Email value object
     * @throws {UserError} If email is empty or has invalid format
     * @factory
     */
    public static create(candidate: string): Email {
        if (!candidate || candidate.trim() === '') {
            throw new UserError(UserErrorType.EMAIL_REQUIRED);
        }

        const normalized = candidate.trim().toLowerCase();

        if (!Email.EMAIL_REGEX.test(normalized)) {
            throw new UserError(UserErrorType.INVALID_EMAIL_FORMAT);
        }

        return new Email(normalized);
    }

    /**
     * Validates a string without creating an instance (useful for DTO validation)
     *
     * @param {string} email - Email candidate
     * @returns {boolean} true if format is valid
     * @static
     */
    public static isValid(email: string | null | undefined): boolean {
        if (!email?.trim()) return false;
        return this.EMAIL_REGEX.test(email.trim().toLowerCase());
    }

    /** @returns {string} The normalized email value */
    public getValue(): string {
        return this.value;
    }

    /** @returns {string} Domain part (after @) */
    public getDomain(): string {
        return this.value.split('@')[1]!;
    }

    /** @returns {string} Local part (before @) */
    public getLocalPart(): string {
        return this.value.split('@')[0]!;
    }

    /**
     * Value-based equality (case-insensitive)
     *
     * @param {Email} other - Another Email instance
     * @returns {boolean}
     */
    public equals(other: Email | null | undefined): boolean {
        if (!other) return false;
        return this.value === other.value;
    }

    /** @returns {string} String representation (useful for logging, JSON, etc.) */
    public toString(): string {
        return this.value;
    }

    /** Allows direct use in templates / JSON serialization */
    public toJSON(): string {
        return this.value;
    }
}