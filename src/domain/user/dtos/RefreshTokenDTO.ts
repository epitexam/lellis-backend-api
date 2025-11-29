/**
 * Data Transfer Object for refresh token
 * @class
 */
export class RefreshTokenDTO {
    /**
     * @param {string} refreshToken - Refresh token
     */
    constructor(
        public readonly refreshToken: string
    ) { }
}