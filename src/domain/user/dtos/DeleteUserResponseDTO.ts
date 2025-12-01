/**
 * Response DTO for user deletion operation
 * @class
 * @dto
 */
export class DeleteUserResponseDTO {
    /**
     * @param {string} deletedUserId - ID of the deleted user
     * @param {Date} deletedAt - Timestamp of deletion
     * @param {boolean} hardDelete - Whether user was hard deleted or soft deleted
     * @param {string} [message] - Optional status message
     */
    constructor(
        public readonly deletedUserId: string,
        public readonly deletedAt: Date,
        public readonly hardDelete: boolean,
        public readonly message?: string
    ) {}
}