/**
 * Data Transfer Object for changing password
 * @class
 */
export class ChangePasswordDTO {
    /**
     * @param {string} currentPassword - Current plain text password
     * @param {string} newPassword - New plain text password
     * @param {string} confirmPassword - New password confirmation
     */
    constructor(
        public readonly currentPassword: string,
        public readonly newPassword: string,
        public readonly confirmPassword: string
    ) { }
}