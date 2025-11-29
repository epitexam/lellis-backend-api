/**
 * Data Transfer Object for updating MFA settings
 * @class
 */
export class UpdateMfaDTO {
    /**
     * @param {boolean} enabled - Whether MFA should be enabled
     * @param {string} [token] - MFA token for verification when enabling
     */
    constructor(
        public readonly enabled: boolean,
        public readonly token?: string
    ) { }
}
