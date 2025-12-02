import { User } from "../../../domain/user/entity/User";
import { UserResponseDTO } from "./UserResponseDTO";

/**
 * Data Transfer Object for paginated user list responses.
 * Encapsulates a list of users with pagination metadata, exposing only non-sensitive data.
 * 
 * @class
 */
export class UserListResponseDTO {
    /**
     * @param {UserResponseDTO[]} users - Array of user DTOs (non-sensitive data)
     * @param {number} total - Total number of users matching the query
     * @param {number} page - Current page number (1-based)
     * @param {number} limit - Number of users per page
     * @param {number} totalPages - Total number of pages based on total and limit
     */
    constructor(
        public readonly users: UserResponseDTO[],
        public readonly total: number,
        public readonly page: number,
        public readonly limit: number,
        public readonly totalPages: number
    ) { }

    /**
     * Creates a UserListResponseDTO from a list of User entities and pagination metadata.
     * 
     * @static
     * @param {User[]} users - Array of domain User entities
     * @param {number} total - Total count of matching users
     * @param {number} page - Current page number
     * @param {number} limit - Number of users per page
     * @returns {UserListResponseDTO} Paginated response DTO
     * 
     * @example
     * const users = [user1, user2]; // Array<User>
     * const dto = UserListResponseDTO.fromUsers(users, 50, 1, 20);
     * // Returns { users: [...], total: 50, page: 1, limit: 20, totalPages: 3 }
     */
    public static fromUsers(
        users: User[],
        total: number,
        page: number,
        limit: number
    ): UserListResponseDTO {
        const userDTOs = users.map(UserResponseDTO.fromUser);
        const totalPages = Math.ceil(total / limit);
        return new UserListResponseDTO(userDTOs, total, page, limit, totalPages);
    }
}