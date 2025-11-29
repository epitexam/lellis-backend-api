import { UserStatus } from "../enums/UserStatus";

/**
 * Data Transfer Object for user query parameters (filtering, sorting, pagination)
 * @class
 */
export class UserQueryDTO {
    /**
     * @param {number} [page] - Page number (default: 1)
     * @param {number} [limit] - Items per page (default: 20)
     * @param {string} [search] - Search term for email or name
     * @param {UserStatus} [status] - Filter by status
     * @param {string} [sortBy] - Field to sort by (default: 'createdAt')
     * @param {'asc' | 'desc'} [sortOrder] - Sort order (default: 'desc')
     */
    constructor(
        public readonly page: number = 1,
        public readonly limit: number = 20,
        public readonly search?: string,
        public readonly status?: UserStatus,
        public readonly sortBy: string = 'createdAt',
        public readonly sortOrder: 'asc' | 'desc' = 'desc'
    ) { }

    /**
     * Calculates the offset for pagination
     * @returns {number} The offset value
     */
    public getOffset(): number {
        return (this.page - 1) * this.limit;
    }
}