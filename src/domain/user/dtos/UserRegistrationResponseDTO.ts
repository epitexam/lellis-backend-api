import { UserResponseDTO } from "./UserResponseDTO";

/**
 * Data Transfer Object for user registration response (includes verification token)
 * @class
 */
export class UserRegistrationResponseDTO {
    /**
     * @param {UserResponseDTO} user - User data
     * @param {string} verificationToken - Email verification token
     * @param {Date} tokenExpiresAt - Token expiration timestamp
     */
    constructor(
        public readonly user: UserResponseDTO,
        public readonly verificationToken: string,
        public readonly tokenExpiresAt: Date
    ) { }
}