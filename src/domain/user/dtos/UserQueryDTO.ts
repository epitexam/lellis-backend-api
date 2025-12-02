import { UserStatus } from "../../../domain/user/enums/UserStatus";

/**
 * Data Transfer Object for user search query parameters.
 * Supports filtering, sorting, and pagination for non-sensitive user data.
 */
export class UserQueryDTO {
    /**
     * @param {number} [page=1] - Current page number (1-based)
     * @param {number} [limit=20] - Number of items per page (max: 100)
     * @param {string} [search] - Partial search term for email, firstName, or lastName
     * @param {UserStatus} [status] - Filter by user status
     * @param {string} [sortBy='createdAt'] - Field to sort by (e.g., 'createdAt', 'lastName')
     * @param {'asc' | 'desc'} [sortOrder='desc'] - Sort direction
     */
    constructor(
        public readonly page: number = 1,
        public readonly limit: number = 20,
        public readonly search?: string,
        public readonly status?: UserStatus,
        public readonly sortBy: string = 'createdAt',
        public readonly sortOrder: 'asc' | 'desc' = 'desc'
    ) {
        if (this.limit > 100) throw new Error('Limit cannot exceed 100');
        if (this.page < 1) throw new Error('Page must be at least 1');
    }

    /**
     * Computes the pagination offset.
     * @returns {number} Offset for database queries
     */
    public getOffset(): number {
        return (this.page - 1) * this.limit;
    }
}