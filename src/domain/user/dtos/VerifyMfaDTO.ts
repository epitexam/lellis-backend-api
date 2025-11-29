/**
 * Data Transfer Object for MFA verification
 * @class
 */
export class VerifyMfaDTO {
    /**
     * @param {string} token - MFA token
     * @param {string} [backupCode] - Backup code (optional)
     */
    constructor(
        public readonly token: string,
        public readonly backupCode?: string
    ) { }
}