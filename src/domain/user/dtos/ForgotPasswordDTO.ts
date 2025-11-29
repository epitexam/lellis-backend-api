/**
 * Data Transfer Object for initiating password reset
 * @class
 */
export class ForgotPasswordDTO {
    /**
     * @param {string} email - User's email address
     */
    constructor(
        public readonly email: string
    ) { }
}
