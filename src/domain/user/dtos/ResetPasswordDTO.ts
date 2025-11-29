/**
 * Data Transfer Object for resetting password
 * @class
 */
export class ResetPasswordDTO {
    /**
     * @param {string} token - Password reset token
     * @param {string} newPassword - New plain text password
     * @param {string} confirmPassword - New password confirmation
     */
    constructor(
        public readonly token: string,
        public readonly newPassword: string,
        public readonly confirmPassword: string
    ) { }
}
