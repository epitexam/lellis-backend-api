import { User } from "../entity/User";
import { UserStatus } from "../enums/UserStatus";

/**
 * Data Transfer Object for user response (without sensitive data)
 * @class
 */
export class UserResponseDTO {
    /**
     * @param {string} id - User ID
     * @param {string} email - User's email
     * @param {string} firstName - User's first name
     * @param {string} lastName - User's last name
     * @param {boolean} mfaEnabled - MFA status
     * @param {Date | null} lastLogin - Last login timestamp
     * @param {UserStatus} status - User status
     * @param {Date} createdAt - Creation timestamp
     * @param {Date} updatedAt - Last update timestamp
     */
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly mfaEnabled: boolean,
        public readonly lastLogin: Date | null,
        public readonly status: UserStatus,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    /**
     * Creates a UserResponseDTO from a User entity
     * @static
     * @param {User} user - The User entity
     * @returns {UserResponseDTO} The response DTO
     */
    public static fromUser(user: User): UserResponseDTO {
        return new UserResponseDTO(
            user.id,
            user.getEmailValue(),
            user.firstName,
            user.lastName,
            user.mfaEnabled,
            user.lastLogin,
            user.status,
            user.createdAt,
            user.updatedAt
        );
    }

    /**
     * Gets the user's full name
     * @returns {string} The concatenated first and last name
     */
    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}