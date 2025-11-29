/**
 * Data Transfer Object for email verification
 * @class
 */
export class VerifyEmailDTO {
    /**
     * @param {string} token - Email verification token
     */
    constructor(
        public readonly token: string
    ) { }
}
