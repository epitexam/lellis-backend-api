import { UserStatus } from "../enums/UserStatus";

/**
 * Data Transfer Object for updating user status
 * @class
 */
export class UpdateUserStatusDTO {
    /**
     * @param {UserStatus} status - New user status
     * @param {string} [reason] - Reason for status change (optional)
     */
    constructor(
        public readonly status: UserStatus,
        public readonly reason?: string
    ) { }
}