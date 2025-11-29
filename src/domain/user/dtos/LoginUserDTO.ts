/**
 * Data Transfer Object for user authentication
 * @class
 */
export class LoginUserDTO {
    /**
     * @param {string} email - User's email address
     * @param {string} password - User's plain text password
     */
    constructor(
        public readonly email: string,
        public readonly password: string
    ) { }
}