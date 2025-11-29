import { UserResponseDTO } from "./UserResponseDTO";

/**
 * Data Transfer Object for authentication response
 * @class
 */
export class AuthResponseDTO {
    /**
     * @param {UserResponseDTO} user - User data
     * @param {string} accessToken - JWT access token
     * @param {string} refreshToken - JWT refresh token
     * @param {boolean} requiresMfa - Whether MFA is required
     */
    constructor(
        public readonly user: UserResponseDTO,
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly requiresMfa: boolean = false
    ) { }
}
